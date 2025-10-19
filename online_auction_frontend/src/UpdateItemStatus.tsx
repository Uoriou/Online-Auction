import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import { useParams } from 'react-router-dom';

/*Update the item status (Available or Expired) */

export async function updateAvailability(status: string){
    
    const { id } = useParams<{ id: string }>();
        const dataToSend = {
            "is_active":false,
        }
        const jsonString = JSON.stringify(dataToSend);
        
        await axios.post(`http://127.0.0.1:8000/auction/item_status/${id}/`,jsonString,{
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
            },             
        }).then( res => {
            console.log("Success",res);
        }).catch(error => {
            alert("Failed to update the status");
        }) 
   
    
}