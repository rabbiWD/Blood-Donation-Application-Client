import React from 'react';
import { Outlet } from 'react-router';
import Aside from '../Components/Aside/Aside';

const DashboardLayout = () => {
    return (
        <div className='flex'>
            <Aside/>
            <div className='flex-1 p-5'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default DashboardLayout;