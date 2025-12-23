// import React, { use } from 'react';
// import { AuthContext } from '../Context/AuthContext';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth()
    console.log(loading);
    console.log(user);
    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate state={location?.pathname} to='/login'></Navigate>
    }
    return children
};

export default PrivateRoute;