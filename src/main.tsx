import ReactDOM from 'react-dom/client'
import Login from './Login.tsx'
import './index.css'
import Register from './Register.tsx'
import Chat from './Chat.tsx'
import Navbar from './Navbar.tsx'
import Footer from './Footer.tsx'
import Error from './Error.tsx'
import Home from './Home.tsx'

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: '/',
        element: ( <> <Home/> </>)
    },
    {
        path: 'login',
        element: (<>
        <Navbar />
        <Login/>
        
        </>)
    },
    {
        path: 'register',
        element: (<>
            <Navbar />
            <Register/>
            
            </>)
    },
    {
        path: 'chat',
        
        element: (<>
            <Chat/>
            </>)
    },
    {
        path: '*',
        element: (<>
            <Error/>
        </>)
    }
])  
  
  
ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
