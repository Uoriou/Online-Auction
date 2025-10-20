import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import { useParams } from 'react-router-dom';

/*Update the item info (Available or Expired) */

export async function update(status: any){
    
    const { id } = useParams<{ id: string }>(); // ! 
    const dataToSend = {
        "is_active":false,
    }
    const jsonData = JSON.stringify(dataToSend);
        
    await axios.post(`http://127.0.0.1:8000/auction/item_status/${id}/`,jsonData,{
        headers:{
            //"Content-Type":"application/json",
            "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
        },             
    }).then( res => {
        console.log("Success",res);
    }).catch(error => {
        alert("Failed to update the item info");
    }) 
   
    
}