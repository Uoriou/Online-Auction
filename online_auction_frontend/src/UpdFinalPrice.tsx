import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';

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

const UpdFinalPrice = (jsonObject: any) =>{

    console.log("Trying to update the price...")
    console.log(jsonObject?.itemId)
    const id:string = jsonObject?.itemId.toString();
    const price:string = jsonObject?.bidPrice.toString()
    console.log("Hey " ,typeof id) // typeof is an operator like % and + 

    const data = {
        "id":id,
        "current_price":price
    } 
    const jsonData = JSON.stringify(data);
    try{

        axios.post(`http://127.0.0.1:8000/auction/bid/${id}/`,jsonData,{
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
            },
                    
        }).then( res => {
            console.log("Success",res);
        });
    }catch{
        alert("Error updating the price")
        return;
    }

}
export default UpdFinalPrice;