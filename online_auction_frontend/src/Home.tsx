import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

interface Item {

    id: number;
    name: string;
    description: string;
    image: string;
    starting_price: number;
    current_price: number; 
    price_history:number;
    created_at:number,
    available_duration:number
    
};


//Item listing 
const Home = () => {

    const [item, setItem] = useState<Item[]>([]);
    // TODO formattedDate use state here to display it independently
    const [formattedDate,setFormattedDate] = useState<any>();
    
    function fetchItems(){
        axios.get("http://127.0.0.1:8000/auction/items/")
        .then(response => {
            console.log(response.data)
            setItem(response.data);
        })
        .catch(error => {
           alert("Failed to fetch items");
        })
        return item
    }

    function fetchItemsWithFormatDate(){
        
        item?.map(i => (
            setFormattedDate(new Date(i.created_at))
            
        ))

        const formatted = formattedDate!.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        // formattedDate useState update here
        console.log(formatted); 
        

    }

    
    
    useEffect(() => {
        const test = fetchItems();
        //console.log(test);
        //fetchItemsWithFormatDate();
    },[]);

    return(
        <>
            <h1>Items</h1>
            <div style = {{
                textAlign: 'center',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                padding: '10px'
            }}>
                {item.map(item => (
                    <div key={item.id}>
                        <p>Name: {item.name}</p>
                        <p>Description: {item.description}</p>
                        <p>Initial Price: {item.starting_price}</p>
                        <p>Price now: {item.current_price}</p>
                        <p>Listed at: {item.created_at} </p>
                        <p>Available for: {item.available_duration} </p>
                        <Link to = {`/item/${item.id}`}>
                            <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} width={250} />
                        </Link>
                    </div>
                ))}

                
            </div>
        </>
    )

} 
export default Home;