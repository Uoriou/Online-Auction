import React from 'react';
import logo from './logo.svg';
import './App.css';
import  Home  from './Home';
import CreateItem  from './CreateItem';
import Bid from './Bid'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import { AppBar, Toolbar, Link, Select,Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';


function Logout(){
  localStorage.clear();
  return <Navigate to = "/login"/>;
}

function RegisterAndLogout(){
    localStorage.clear();
    return <Register />
}


function App() {
  return (

    <Router>
       <AppBar position="static" sx={{ backgroundColor: "#556B2F" }}>
          <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link data-toggle="tab" href="/items"  underline="none" sx={{ mr: 3, color: "#000000" }}><HomeIcon/></Link>
            <Link data-toggle="tab" href="/add_item" underline="none" sx={{ mr: 3, color: "#000000"}}><AddCircleIcon/></Link>
          </Box>
          <Link data-toggle="tab" href="/logout" underline="none" sx={{ mr: 3, color: "#000000"}}><LogoutIcon/></Link>
          </Toolbar>
      </AppBar>
     
      <Routes>
        <Route path="/items" element={<Home/>} />
        <Route path = "/register" element={< RegisterAndLogout/>}/>
        <Route path = "/login" element={< Login/>}/>
        <Route path="/add_item" element={
            <ProtectedRoute>
                <CreateItem/>
            </ProtectedRoute>
        } />
        <Route path = "/logout" element = {<Logout/>}/>
        <Route path = "/item/:id" element = {
          <ProtectedRoute>
            <Bid/>
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
