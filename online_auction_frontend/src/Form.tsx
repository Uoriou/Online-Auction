import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { ACCESS_TOKEN,REFRESH_TOKEN } from './Constants';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate, Link,useLocation } from 'react-router-dom';

//This is extended dynamically to register and login components
//props
const Form = ({route,method}:any) =>{

    const [username,setName] = useState("");
    const [password,setPassword] = useState("");
    const [open,setOpen] = React.useState(false);
    const [userMethod,setUserMethod] = useState("");
    const [error,setError] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [regDirect,setRegDirect] = useState<boolean | null>(null);
    const sleep = (ms:any) =>{
        return new Promise(r => setTimeout(r, ms));
    } 
 
    const handleOnSubmit = async(e:React.SyntheticEvent) =>{
        e.preventDefault();
        try{

            if(method=== "Register"){
                const res = await axios.post("http://127.0.0.1:8000/auction/register/",{
                    username: username,
                    password: password,
                });
                setError(false);
            }
            
            if(method === "Login"){
                const res = await axios.post("http://127.0.0.1:8000/auction/token/",{
                    username: username,
                    password: password,
                });
                localStorage.setItem(ACCESS_TOKEN,res.data.access);
                localStorage.setItem(REFRESH_TOKEN,res.data.refresh);
            
                setError(false);
                await sleep(3000)
                navigate("/items");
                //Once logged in go back to the previous page  
                console.log("Previous path:", location.pathname);
                //but next path doest exist 
                <Link to="/nextpath" state={{ prevPath: location.pathname }}>Example Link</Link>
            }
        }catch{
            setError(true);
            alert("System Error")
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,) =>{
        setOpen(false);
    }

    useEffect(() => {
        if(method === "Login"){
            setRegDirect(true);
        }else{
            setRegDirect(false);
        }
    },[method])

    function redirectRegister(){
        var link = <a href={"/register"}>here</a>;
        return <div> {link}</div>;
    }
    
    return(
        <div style = {{textAlign: 'center'}}>
            <h1>{method === "Login" ? "Login" : "Register"}</h1> 
            <form onSubmit = {handleOnSubmit}>
                <input type="text" placeholder='Name' value={username} onChange={(e) => setName(e.target.value)}/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button variant="contained" color="primary" type="submit" onClick={(e) => setOpen(true)}>Submit</Button>
                
            </form>
            <br/>
            {regDirect && <div>Do not have an account ? Please register</div>}
            {redirectRegister()}
            {error === false ? (
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                > 
                {method} success ! Redirecting...  
                </Alert>
            </Snackbar>
            ) : null}
        </div>
    )
}

export default Form;
