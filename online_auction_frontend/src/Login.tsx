import React, { useEffect, useState,  } from 'react';
import { ACCESS_TOKEN } from './Constants';
import Form from './Form';

const Login = () =>{

    return (
        <Form route = "/auction/token/" method = "Login"></Form>
    )
}

export default Login;

