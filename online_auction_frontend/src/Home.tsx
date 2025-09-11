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
    available_duration:number,
    expires_at:number
    
};


//Item listing 
const Home = () => {

    const [item, setItem] = useState<Item[]>([]);
    
    function fetchItems(){
        axios.get("http://127.0.0.1:8000/auction/items/")
        //Format the date and update the state array 
        // ...item, means that it copies all the property into a new object 
        // and we override expires_at with a formatted version

        .then(response => {
            const formattedItems = response.data.map((item: any) => ({
            ...item,
                expires_at: new Date(item.expires_at).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            }));

            setItem(formattedItems);
        })
        .catch(error => {
           alert("Failed to fetch items");
        })
        
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
                        <p>Expires at: {item.expires_at} </p>
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