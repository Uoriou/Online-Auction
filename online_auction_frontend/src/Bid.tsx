import React, { useEffect, useState,  } from 'react';
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
    let bidsArr: string[] = []; // creating an dynamic array for stacks
    const [open,setOpen] = React.useState(false);

    
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

     // TODO Java websocket 
        //const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/websocket',
            webSocketFactory: () => new SockJS('http://localhost:8080/websocket'), // Optional: for SockJS fallback
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/topic/greetings', message => {
                console.log('Received message:', JSON.parse(message.body));
                // Update React state with the received message
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

        stompClient.activate(); 
    
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
                const bid = {
                    "item_id":item.id,
                    "new_bid_price":new_bid
                }
                //socket.send(JSON.stringify(bid)); 
                // To send a message:
                stompClient.publish({
                    destination: '/app/test',
                    body: JSON.stringify(bid),
                });
                console.log("OK");
                    // Then, dynamically adjust the number of stacks
                    //  as the prices from the web socket get placed
                if(new_bid){
                    bidsArr.push(new_bid.toString());// change it to use state 
                }
                setOpen(true)
            }catch(e){
                alert("Problem with the websocket sending")
                console.error(e)
            // The following is a python segment to simply update the price of an item
            // TODO, well here is an idea -> what about displaying every bid price, while keeping the 
            // TODO original price there on the screen ?
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
    // Item stacks expand dynamically as bids get placed
    // Create an array to simulate the expanding Item stacks 
    //But first show placed bids price if any, then real-time changes can take place
    const alreadyPlaced = () => {// show the already placed bids, retrieve them from Django

    }

    useEffect(() => {
        fetchItemToBid();
        getAccessToken();
       

    },[]);

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
                    Bid History
                    
                    {/*The argument is going to be a bid price */}   
                    <Stack>
                        <Item>
                            {bidsArr} {/*Use useState instead */}
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
