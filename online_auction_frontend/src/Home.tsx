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
};


//Item listing 
const Home = () => {

    const [item, setItem] = useState<Item[]>([]);

    const API_URL_DJANGO= "http://127.0.0.1:8000/auction/items/";
    const API_URL_CROW = "http://localhost:9181/items";

    function fetchItems(){
        //I think we can  use CROW C++ API here
        //"http://127.0.0.1:8000/auction/items/" -> Django
        // 'http://localhost:9181/items' -> CROW
        axios.get("http://127.0.0.1:8000/auction/items/")
        .then(response => {
            console.log(response.data);
            setItem(response.data);
        })
        .catch(error => {
           alert("Failed to fetch items");
        }
        )
    }
    useEffect(() => {
        fetchItems();
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