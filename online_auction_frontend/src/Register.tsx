import React, { useEffect, useState,  } from 'react';
import { ACCESS_TOKEN } from './Constants';
import Form from './Form';

const Register = () =>{

    return (
        <Form route = "/auction/register/" method = "Register"></Form>
    )
}

export default Register;