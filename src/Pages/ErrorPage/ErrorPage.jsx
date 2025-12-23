import React from 'react';
import errorImg from '../.././assets/error-404.png'
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
         <div className='flex justify-center items-center p-10'>
            <div className=''>
           <img src={errorImg} alt="" />
           <div className='text-center'>
             <h1 className='text-4xl font-bold mt-3'>Oops, page not found!</h1>
             <p className='text-sm font-normal text-gray-500 mt-2'>The page you are looking for is not available.</p>
              <Link to='/' className="btn bg-linear-to-r from-[#632ee3] to-[#9f62f2] text-white font-semibold text-base mt-5">Go Back</Link>
           </div>
        </div>
        </div>
    );
};

export default ErrorPage;