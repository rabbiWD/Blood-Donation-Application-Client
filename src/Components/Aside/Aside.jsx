import React from 'react';
import { NavLink } from 'react-router';

const Aside = () => {
    return (
        <aside className='w-64 bg-gray-500 text-gray-200 min-h-screen p-5 flex flex-col'>
            {/* logo */}
            <div className='text-2xl font-bold mb-10 text-white tracking-wide'>
                AdminPanel
            </div>

            {/* Navigate */}
            <nav className='flex flex-col gap-3'>
                <NavLink to='/dashboard/main' className={({isActive})=>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`
                }>
                    <HomeIcon className= 'h-5 w-5' />
                    Dashboard
                </NavLink>

                <NavLink to='/dashboard/users' className={({isActive})=>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`
                }>
                    <UserCircleIcon className= 'h-5 w-5' />
                    Users
                </NavLink>

                 <NavLink to='/dashboard/settings' className={({isActive})=>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`
                }>
                    <Cog6ToothIcon className= 'h-5 w-5' />
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
};

export default Aside;