import React, { useEffect, useState,  } from 'react';
import axios from 'axios';
import { useLocation,useParams } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

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
    const [file,setFile] = useState<File | undefined>();
    const [form,setForm] = useState<Item>(defaultItem);
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [startingPrice,setStartingPrice] = useState(0);
    const [currentPrice,setCurrentPrice] = useState(0);
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

    const socket = new WebSocket("ws://localhost:3333/websocket");
    socket.onopen = () => {

        console.log("WebSocket connection to C++ opened");

    };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data.message); 
       
    };
            
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
                socket.send(JSON.stringify(bid)); 
                setOpen(true)
            }catch{
                alert("Problem with the websocket")

            // C++ should be used in the following and change the link to a C++ end point 
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

    useEffect(() => {
        fetchItemToBid();
        //refreshAccessToken();
        getAccessToken();
        
    },[]);

    return (
        <>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

            <h1>Item: {id} </h1> 
            <div className="container text-center">

                    <div className="row">
                        <div className="col-lg-6">

                            {item ? (
                                <div key={item.id}>
                                    <p>Name: {item.name}</p>
                                    <img 
                                        src={`http://127.0.0.1:8000/${item.image}`} 
                                        alt={item.name} width={300} 
                                        className="rounded mx-auto d-block" 
                                    />
                                    <p>Description: {item.description}</p>
                                    <h3>Initial Price €: {item.starting_price}</h3> 
                                    <h2>Price now €  {item.current_price}</h2> {/*if else to check  if there is authentication error */}
                                </div>
                                ): ( <p>Loading...</p>)
                            }
                        </div>
                       
                        <div className="col-lg-6">
                            Price €: 
                            <form onSubmit={handleBidSubmit}>
                                <input type = "text" onChange={(e) => setBidHistory([e.target.value])}></input>
                                <button 
                                    className="btn btn-primary"> Place bid
                                </button>
                            </form>
                            
                        </div>
                    </div>
                   
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
