import React, { useEffect, useState, useRef} from 'react';
import { useLocation,useParams } from 'react-router-dom';
import axios from 'axios';
import { ACCESS_TOKEN } from './Constants';


function BidHistoryView(id:string) {
   
    // ! The model might be dodgy so double check 
    return  axios.get(`http://127.0.0.1:8000/auction/bid_history/${id}/`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
        }
    })
    
}
export default BidHistoryView;