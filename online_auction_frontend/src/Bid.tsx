import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useLocation,useParams } from 'react-router-dom';
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
import TimerIcon from '@mui/icons-material/Timer';
import { Typography } from "@mui/material";
import {getAccessToken} from './Tokens';


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
//The fields should be exactly the same as models.py
interface Item  {
    
    id:number,
    name:string,
    description:string,
    image:string,
    starting_price:number,
    current_price:number,
    is_active:Boolean,
    available_duration:number,
    expires_at:number

}

const defaultItem: Item = {
   
    id:0,
    name:"",
    description:"",
    image:"",
    starting_price:0,
    current_price:0,
    is_active:false,
    available_duration:0,
    expires_at:0
}

const Bid = () => {

    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>();
    const [bidHistory,setBidHistory] = useState<string[]>([]);//Change the data type
    const stompClientRef = useRef<any>(null); // keep client reference
    const [bidsRt,setBidsRt] = useState<any[]>([]); // Bids to be displayed on the stack 
    const [open,setOpen] = React.useState(false);
    const [currentTime, setCurrentTime] = useState(new Date()); // Current time
    const [timer,setTimer] = useState<number>(); // useState to display the time on the screen
    const [isTimerUp,setIsTimerUp] = useState<Boolean | null>(false); 
    //If the timer is up, then set the item status, which also hides the bid button
    const [itemStatus,setItemStatus] = useState<"" | "EXPIRED" | "SOLD">("");
    
    function fetchItemToBid(cb: Function){
        axios.get(`http://127.0.0.1:8000/auction/item/${id}/`)
        .then((res) =>{
            const expiresAt = new Date(res.data.expires_at).toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            // ! it is not properly handling the logic
            // ! time format is not consistent
            let d = new Date();
            if (new Date(expiresAt) < d){
                setItemStatus("EXPIRED");
                setIsTimerUp(true);
                console.log("Expired")
            }else{
                console.log(expiresAt)
                let d = new Date();
                console.log(d)
            }
            cb(); // Just testing 
            
            setItem({
            ...res.data,
                expires_at: new Date(res.data.expires_at).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            })
        })
        .catch((err) =>{
            alert("Failed to load the data " + err)
        })
    }
    
    useEffect(() => {
        // A built in js function to manage the time 
        const intervalTime = setInterval(() => {
            // callback (arrow function or normal function) = the operation you want to be called later inside setInterval
            setCurrentTime(new Date());
        }, 1000); // Update every  (1 second)
        fetchItemToBid(()=>{
            console.log("callback")
        });
        getAccessToken(); //Necessary token function
        
        // Websocket 
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/websocket',
            webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
            debug: (str) => {
                console.log(str); // It is printing out some debug messages 
            }, 
            onConnect: () => {
                stompClient.subscribe('/topic/greetings', message => {
                    console.log('Received message for the transactions:', JSON.parse(message.body)); 
                    //Then append the message to the useState array
                    setBidsRt((prev) => [...prev, JSON.parse(message.body)]);
                });
                stompClient.subscribe('/topic/timer',message=>{
                    let time = JSON.parse(message.body)["time"] 
                    console.log('Received message for the timer:', Number(time));  
                    setTimer((prev)=> Number(time) + 1);
                });
                stompClient.subscribe('/topic/status',message=>{
                    console.log("Received message for the status:" ,JSON.parse(message.body)["status"]);
                    setItemStatus(JSON.parse(message.body)["status"]);
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
        // !  I just added this, could be erroneous
        return () => {
            console.log("Cleaning up WebSocket...");
            stompClient.deactivate();
            stompClientRef.current = null;
            clearInterval(intervalTime);
        };
       
    },[]);
   
    async function handleBidSubmit(e:React.SyntheticEvent){
        
        e.preventDefault();
        const new_bid = Number(bidHistory[0]);// lst index ? 
        if (item && new_bid > item.current_price) {
            //This creates / updates a new object with the same properties as item
            setItem({ ...item, current_price: new_bid });
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
                    // TODO Timer countdown happens when the time remain is within the set duration
                    // Todo and if somebody placed a bid
                
                    let secondsLeft = item?.available_duration;
                    const countDown = setInterval(() => {
    
                        const expiresAt = new Date(item.expires_at);
                         
                        if (new Date() < expiresAt) {
                            console.log("It is not expired yet ! ")
                        }else{
                            console.log("Expired")
                        }
                        secondsLeft!--;
                        stompClientRef.current.publish({
                            destination:"/app/timerHello",
                            body: JSON.stringify( {
                                "time":secondsLeft,  
                            }),
                        });
                        // ! Double check here 
                       // If the timer is up and somebody placed a bid, then the following happens
                        console.log(timer)
                        if (secondsLeft! < 0) {
                            clearInterval(countDown); 
                            //setIsTimerUp(true);
                            console.log("Time 0")
                            stompClientRef.current.publish({
                                destination:"/app/itemStatus",
                                body: JSON.stringify({
                                    "status":"SOLD",
                                })
                            });
                            return;
                        }
                    }, 1000);
                    
                }else{
                    console.error("Not connected to the websocket");
                }
                setOpen(true)
            }catch(e){
                alert("Problem with the websocket sending")
                console.error(e)
            } 
           
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
            {/*If the timer is up (isTimerUp) then the item will become unavailable  */}
          
            {!isTimerUp && (
                <Typography variant="body1" color="textSecondary">
                    <TimerIcon/>  Time now: {currentTime.toLocaleString()}
                    <TimerIcon/> Time left: {timer}s
                </Typography>
            )}         
  
            <Box display="flex" gap={2}>
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
                            <p>Expires: {item.expires_at}</p>
                            <h2>Price now €  {item.current_price}</h2> {/*if else to check  if there is authentication error */}
                        </div>
                        ): 
                        ( <p>Loading...</p>) 
                    }
                    {item && !isTimerUp ? (
                        <form onSubmit={handleBidSubmit}>
                            <input type = "text" onChange={(e) => setBidHistory([e.target.value])}></input>
                            <Button type="submit"> 
                                Place bid €
                            </Button>
                        </form>
                        ) : (
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="error"
                            sx={{
                                position: "absolute",
                                fontSize: "2rem",
                                opacity: 0.9,
                            }}
                        >
                        {itemStatus}
                        </Typography>
                    )}
                   
                </Grid>
               
                {/*Web socket real time bid inside a box -- >  */}
                <Grid sx={{ backgroundColor: 'grey.200', p: 2 }}>
                    Real Time Bids Transactions
                    <Stack>
                        <Item>
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
