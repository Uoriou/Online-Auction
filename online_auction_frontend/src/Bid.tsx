import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useLocation,useParams } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

//A user can only bet if they are registered and authenticated
//The above logic is handled in Login.tsx

interface Item  {
    //The field should be exactly the same as models.py
    id:number,
    name:string,
    description:string,
    image:string,
    starting_price:number,
    current_price:number,
    is_active:Boolean

}

const defaultItem: Item = {
   
    id:0,
    name:"",
    description:"",
    image:"",
    starting_price:0,
    current_price:0,
    is_active:false,
}

const Bid = () => {

    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>();
    const [bidHistory,setBidHistory] = useState<string[]>([]);//Change the data type
    const stompClientRef = useRef<any>(null); // keep client reference
    const [bidsRt,setBidsRt] = useState<any[]>([]); // Bids to be displayed on the stack 
    const [open,setOpen] = React.useState(false);
    let secondsLeft = 10; // logging the time for debugging 
    const [timer,setTimer] = useState<any>(); // useState to display the time on the screen

    function fetchItemToBid(){
        axios.get(`http://127.0.0.1:8000/auction/item/${id}/`)
        .then((res) =>{
            setItem(res.data)
            console.log(res.data) 
        })
        .catch((err) =>{
            alert("Failed to load the data " + err)
        })
    }

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }
    
        const response = await axios.post('http://127.0.0.1:8000/auction/token/refresh/', {
            refresh: refreshToken,
        });
    
        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    };
    
    const getAccessToken = async () => {
        let accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            accessToken = await refreshAccessToken();
        }

        return accessToken;
    } 

     useEffect(() => {
        fetchItemToBid();
        getAccessToken();

        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/websocket',
            webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
            debug: (str) => {
                console.log(str); // It is printing out some messages 
            }, 
            onConnect: () => {
                stompClient.subscribe('/topic/greetings', message => {
                    console.log('Received message for the transactions:', JSON.parse(message.body)); 
                    // {itemId: x,bidPrice: y}
                    //Then append the message to the useState array
                    setBidsRt((prev) => [...prev, JSON.parse(message.body)]);
                     
                });
                //! The code is erroneous
                stompClient.subscribe('/topic/timer',message=>{
                    console.log('Received message for the timer:', JSON.parse(message.body));  
                    setTimer((prev:any)=> JSON.parse(message.body) + 1); // is there a return type mismatch ?
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
            onStompError: frame => {
                console.error('Broker reported error:', frame.headers['message']);
                console.error('Additional details:', frame.body);
            },
        });

        stompClientRef.current = stompClient;
        stompClient.activate(); 
       
    },[]);

    useEffect(() =>{

        const countdown = setInterval(() => {
            console.log(`Time left: ${secondsLeft} seconds`);
            secondsLeft--;
            // TODO Make sure java websocket receives the time 
            stompClientRef.current.publish({
                destination:"/timerHello",
                 body: JSON.stringify( {
                    "time":secondsLeft,  
                }),
            });
            if (secondsLeft < 0) {
                clearInterval(countdown); // Stop the timer when it reaches zero
                console.log("Timer complete!");
            }
        }, 1000);
    },[]);
    
    async function handleBidSubmit(e:React.SyntheticEvent){
        
        e.preventDefault();
        const new_bid = Number(bidHistory[0]);// lst index ? 
        if (item && new_bid > item.current_price) {
            //This creates / updates a new object with the same properties as item
            setItem({ ...item, current_price: new_bid });

            const formData = new FormData();
            formData.append("name" ,item.name);
            formData.append("description" ,item.description);
            formData.append("starting_price" ,item.starting_price.toString());
            formData.append("current_price" ,new_bid.toString()); //update the price
            try{
                
                // Sending to Java backend websocket
                if(stompClientRef.current && stompClientRef.current.connected){ // previously if(stompClient) 
                    console.log("Sending...")
                    //previously stompClient.publish()
                    stompClientRef.current.publish({
                        destination: '/app/hello', 
                        body: JSON.stringify( {
                            "itemId":item.id, // Changed from item_id
                            "bidPrice":new_bid //Changed from new_bid_price
                        }),
                    });

                }else{
                    console.error("Not connected to the websocket");
                }
                setOpen(true)
            }catch(e){
                alert("Problem with the websocket sending")
                console.error(e)
            // The following is a python segment to simply update the price of an item
            // TODO, Update the price of an item only after the auction timer is up
            // TODO until then, just display the most recent bid price on the price section 
            }
            /*try{

                await axios.post(`http://127.0.0.1:8000/auction/bid/${id}/`,formData,{
                    headers:{
                        "Content-Type":"multipart/form-data",
                        "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
                    },
                    
                }).then( res => {
                    console.log("Success",res);
                });
            }catch{
                alert("Could not bid")
                return;
            }*/
        }else{
            alert("Bid must be higher than the current price")
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,) =>{
        setOpen(false);
    }
   

    return (
        <>
            <h1>Item: {item?.name} </h1> 
            <Box display="flex" gap={2}>
                {/*The leftmost grid */}
                <Grid sx={{ backgroundColor: 'black.200', p: 2 }}>
                    {item ? (
                        <div key={item.id}>
                            {/*Apparently you are mediocre if you use <img> */}
                            <picture>
                                <img 
                                    src={`http://127.0.0.1:8000/${item.image}`} 
                                    alt={item.name} width={300} 
                                    className="rounded mx-auto d-block" 
                                />
                            </picture>
                            
                            <p>Description: {item.description}</p>
                            <h3>Initial Price €: {item.starting_price}</h3> 
                            <h2>Price now €  {item.current_price}</h2> {/*if else to check  if there is authentication error */}
                        </div>
                        ): 
                        ( <p>Loading...</p>)
                    }
                    Price €: 
                    <form onSubmit={handleBidSubmit}>
                        <input type = "text" onChange={(e) => setBidHistory([e.target.value])}></input>
                        <Button type="submit"> 
                            Place bid
                        </Button>
                    </form>
                </Grid>
               
                {/*Web socket real time bid inside a box -- >  */}
                <Grid sx={{ backgroundColor: 'grey.200', p: 2 }}>
                    Real Time Bids Transactions
                    {/*The argument is going to be a bid price */}   
                    <Stack>
                        <Item>
                            {/*Just need to add one but the same price gets added for the length of array */}
                            {/* // ? So instead use a simple array ? */}
                            {bidsRt.map((bid, index) => (
                                <li key={index}>
                                    ✔️ Price: {bid.bidPrice} €
                                </li>
                            ))}
                            
                        </Item >
                    </Stack>
                </Grid>
            </Box>
            <div > 
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    > 
                        Bid success ! 
                    </Alert>
                </Snackbar>
                    
            </div>
        </>
    );
};

export default Bid;
