import axios from 'axios';
import React from 'react';

const axiosSecure = axios.create({
    baseURL:""
})

const UseAxiosSecure = () => {
    return axiosSecure
};

export default UseAxiosSecure;