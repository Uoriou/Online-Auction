import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import axios from 'axios';
import logo from 'logo.svg';

interface Item  {

    name:string,
    description:string,
    image:string,
    startingPrice:number,
    currentPrice:number,
    is_active:Boolean

}

const defaultItem: Item = {
   
    name:"",
    description:"",
    image:"",
    startingPrice:0,
    currentPrice:0,
    is_active:false,
}

const CreateItem = () => {

    type uploadStatus = 'idle' | 'pending' | 'success' | 'error';// A new alternative way to boolean  
    
    const [status,setStatus] = useState<uploadStatus>('idle');
    const [file,setFile] = useState<File | undefined>();
    const [form,setForm] = useState<Item>(defaultItem);
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [startingPrice,setStartingPrice] = useState(0);
    const [currentPrice,setCurrentPrice] = useState(0);

    // ! In models.py a new filed available duration has been created so an erroneous behaviour is expected here 
    async function handleOnSubmit(e: React.SyntheticEvent){
        e.preventDefault();
        if(!file) return;//In case theres something wrong with on change
        setStatus('pending');
        const formData = new FormData();
        formData.append("name" ,name);
        formData.append("description" ,description);
        formData.append('image',file);
        formData.append("starting_price" ,startingPrice.toString());
        formData.append("current_price" ,currentPrice.toString());

        
        try{
            await axios.post("http://127.0.0.1:8000/auction/add/",formData,{
                headers:{
                    "Content-Type":"multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN) || ''}`
                },
            }).then( res => {
                console.log("Success",res);
                setStatus('success')
                setName("");
                setDescription("");
                setStartingPrice(0);
                setCurrentPrice(0);
                setFile(undefined);
            });
        }catch{
            alert("Could not add an item")
        }
    }

    //handling the form data, takes an even e as a parameter, especially from React <input> filed type 
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));  
    }

    //Get the file / image from the input when on change event is triggered
    function handleOnChangeFile(e:React.FormEvent<HTMLInputElement>){
       
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        if(target.files){
            // console.log('File', target.files[0].name);
            console.log('File', target.files);
            setFile(target.files[0]);
        }
    }
    return(

        <>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

            <form style={{width: '60%', margin: 'auto', marginTop: '50px'}} onSubmit={handleOnSubmit}>
            <h1>Add your item</h1>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <p className="help-block">Please provide a name of your item.</p>
                <input type="text" className="form-control" id="name" name="name" placeholder="Name" value = {name} onChange={(e) => setName(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label htmlFor="des">Description</label>
                <p className="help-block">Please provide a description of your item.</p>
                <textarea className="form-control" rows={3} name = "description" value = {description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div className="form-group form-group-md">
                <label className="col-sm-2 control-label" htmlFor="initial">Initial Price €</label>
                <div className="col-sm-10">
                <input className="form-control" 
                    type="number" id="startingPrice" 
                    name = "startingPrice" placeholder="Initial Price" 
                    value={startingPrice} onChange={(e) => 
                    {setStartingPrice(Number(e.target.value));setCurrentPrice(Number(e.target.value))}}/>
                </div>
            </div>
           

            <div className="form-group">
                <label htmlFor="image">Image</label>
                <p className="help-block">Please submit an image of your item.</p>
                <div className='col-image'>
                <input type="file" id="image" onChange={handleOnChangeFile}/>
                </div>
            </div>

            {file && status !== "pending" && <button type="submit" className="btn btn-primary" >Add Item</button>}
            
            {status === "success" &&   (
                <div className="alert alert-success">
                    <strong>Success!</strong> Item has been added
                </div>
            )}

            {status === "error" && (
                <div className="bg-danger">
                <strong>Success!</strong> Item has been added
            </div>
            )}
            

            </form>
        </>
    );
};

export default CreateItem;