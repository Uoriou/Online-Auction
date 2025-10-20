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
import {update} from './UpdateItemStatus';
import updFinalPrice from './UpdFinalPrice';

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
    const countDownRef = useRef<any>(null);
    const [bidsRt,setBidsRt] = useState<any[]>([]); // Bids to be displayed on the stack 
    const [open,setOpen] = React.useState(false);
    const [currentTime, setCurrentTime] = useState(new Date()); // Current time
    const [timer,setTimer] = useState<number>(); // useState to display the time on the screen
    const [isTimerUp,setIsTimerUp] = useState<Boolean | null>(false); 
    const [remainingTime, setRemainingTime] = useState<string>("");
    //If the timer is up, then set the item status, which also hides the bid button
    const [itemStatus,setItemStatus] = useState<"" | "EXPIRED" | "SOLD">("");
    
    function fetchItemToBid(cb: Function){
        axios.get(`http://127.0.0.1:8000/auction/item/${id}/`)
        .then((res) =>{
            const expiresAt = new Date(res.data.expires_at); 
            let now = new Date();
            //Checks if the item is expired in the first place before bidding
            //But it checks later the expiry date 

            // TODO isnt it better to get the message that says "Expired" from django 
            // TODO so at some point in the code, when the time is up, or update the status
            if(expiresAt < now){
                //setItemStatus("EXPIRED");
                setIsTimerUp(true); // ! Enabled for now 
               
            }else {
                console.log("Expires on:", expiresAt);
                console.log("Now:", now);
            }
            cb(); // Just testing 
            setItem({
                ...res.data,
                expires_at: res.data.expires_at 
            })
        })
        .catch((err) =>{
            alert("Failed to load the data " + err)
        })
    }

    // Todo also update the item status in django
    function winner(bidHistory:string){

        if(bidHistory){ 
            stompClientRef.current.publish({
                destination:"/app/itemStatus",
                body: JSON.stringify({
                    "status":"SOLD",
                })
            });
            console.log("The Winner has been determined")
            return 0;
        }
        console.log("No winner has been determined")
        return -1;
    }

    
    useEffect(() => {
        
        fetchItemToBid(()=>{
            console.log("callback")
        });
        getAccessToken(); //Necessary token function
        
        // Websocket logic 
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/websocket',
            webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
            debug: (str) => {
                console.log(str); // It is printing out some status messages 
            }, 
            onConnect: () => {
                stompClient.subscribe('/topic/greetings', message => {
                    console.log('Received message for the transactions:', JSON.parse(message.body)); 
                    //Then append the message to the useState array
                    setBidsRt((prev) => [...prev, JSON.parse(message.body)]);
                    updFinalPrice(JSON.parse(message.body));
                });
                stompClient.subscribe('/topic/timer',message=>{
                    let time = JSON.parse(message.body)["time"] 
                    console.log('Received message for the timer:', Number(time));  
                    setTimer(Number(time));
                });
                stompClient.subscribe('/topic/status',message=>{
                    console.log("Received message for the status:" ,JSON.parse(message.body)["status"]);
                    const status:string = JSON.parse(message.body)["status"];
                    if(status == "SOLD"){
                        setItemStatus(status); 
                        update(status); //!  Could be an issue ?
                        console.log("SOLD here man")
                    }
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
        return () => {
            console.log("Cleaning up WebSocket...");
            stompClient.deactivate();
            stompClientRef.current = null;
            //clearInterval(intervalTime);
        };
        
    },[]);
    // TODO if the timer is up, websocket ItemStatus is triggered
    // Use effect that watches for timer changes to the timer and the status
    useEffect(() => {
        // A built in js function to manage the time 
        const intervalTime = setInterval(() => {
            // callback (arrow function or normal function) = the operation you want to be called later inside setInterval
            setCurrentTime(new Date());
            // Calculate remaining time if item exists
            if (item?.expires_at) {
                const now = new Date().getTime();
                const expiryTime = new Date(item.expires_at).getTime();
                const timeLeft = expiryTime - now;
                
                if (timeLeft <= 0) {
                    setIsTimerUp(true);
                    // Broadcast the status to other machines if a winner is determined using websocket
                    if(bidsRt.length == 0){
                        setItemStatus("EXPIRED");
                        setRemainingTime("EXPIRED");
                    }else{
                        winner(bidsRt[bidsRt.length - 1].bidPrice.toString());
                    }
                } else {
                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    
                    setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }
            }
        }, 1000); // Update every second

        if(isTimerUp && countDownRef.current){
            clearInterval(countDownRef.current);
            countDownRef.current = null;
        }
        return()=>{
            clearInterval(intervalTime);
        }
    }, [timer, itemStatus, bidsRt, isTimerUp, item?.expires_at]);

    
    async function handleBidSubmit(e:React.SyntheticEvent){
        
        e.preventDefault();
        const new_bid = Number(bidHistory[0]);
        if (item && new_bid > item.current_price) {
            setItem({ ...item, current_price: new_bid });//Updating the price only while coping the properties 
            try{
                // Sending to Java backend websocket
                if(stompClientRef.current && stompClientRef.current.connected){ // previously if(stompClient) 
                    stompClientRef.current.publish({
                        destination: '/app/hello', 
                        body: JSON.stringify( {
                            "itemId":item.id,
                            "bidPrice":new_bid 
                        }),
                    });
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
                <>
                    <Typography variant="body1" color="textSecondary">
                        <TimerIcon/>  Time now: {currentTime.toLocaleString()}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                         <TimerIcon/>  Time remaining: {remainingTime}
                    </Typography>
                </>
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
                            <p style={{ color: "red", fontWeight: "bold" }}>Expires on: {new Date(item.expires_at).toLocaleString("en-GB", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}</p>
                            <h2>Price now €  {item.current_price}</h2> {/*if else to check  if there is authentication error */}
                        </div>
                        ): 
                        ( <p>Loading...</p>) 
                    }{/*<form onSubmit={handleBidSubmit}>*/}
                    {item && !isTimerUp ? (
                        <form onSubmit={(e) => handleBidSubmit(e)}>{/*Is this ok ? -> No, both function executing at the same time */}
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
