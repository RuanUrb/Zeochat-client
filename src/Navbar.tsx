import React from 'react';
import { useLocation } from 'react-router-dom';


const Navbar = () => {
    const location = useLocation()
    const current = location.pathname

    return (
        <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4 footer-glassmorphism">
            <div className="container mx-auto flex items-center justify-between ">
                <div className="">
                    <p className='text-white text-2xl font-bold inline-block'><a href='/'>Zeochat</a></p>
                    <p className='text-md text-white inline-block md:ml-4'>Where your right to stay anonymous is zealed for.</p>
                </div>
                <div className="flex space-x-4 ml-3">
                    <a href="/register" className={`text-white ${current === '/register' ? 'text-gray-400 cursor-not-allowed underline' : 'hover:text-gray-300'}`}>Register</a>
                    <a href="/login" className={`text-white ${current === '/login' ? 'text-gray-400 cursor-not-allowed underline' : 'hover:text-gray-300'}`}>Login</a>
                    <a href="/chat" className={`text-white ${current === '/' ? 'hover:text-gray-400' : ''}`}>Chat</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;