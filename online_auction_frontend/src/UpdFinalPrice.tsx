import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
// The following is a python segment to simply update the price of an item
// TODO, Update the price of an item only after the auction timer is up
// TODO until then, just display the most recent bid price on the price section 
// TODO could import it from a different file to practice decomposition
// TODO  add available_duration 
// TODO Finally call this inside Bid.tsx
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

const UpdFinalPrice = (jsonObject:JSON) =>{
    console.log("Trying to update the price...")
    // Change all to a simple Json
    //const formData = new FormData();
    //formData.append("name" ,item.name);
    //formData.append("description" ,item.description);
    //formData.append("starting_price" ,item.starting_price.toString());
    //formData.append("current_price" ,new_bid.toString()); //update the price  
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

}
export default UpdFinalPrice;