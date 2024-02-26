import axios from 'axios'
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { useNavigate } from "react-router-dom";
import './index.css'
import Spinner from './Spinner';


const setAccess = (accessToken: any)=>{
    const cookies = new Cookies()
    cookies.set('access_token', accessToken)
}

const getAccess = ()=>{
    return new Cookies().get('access_token')
}

const deleteCookie = (cookieName: string)=>{
    const cookies = new Cookies()
    cookies.remove(cookieName)
}

function Login(){
    const [flashVisibility, setFlashVisibility] = useState(false)
    const [flashMessage, setFlashMessage] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
      if(flashVisibility){
        const timeoutId = setTimeout(()=>{
          setFlashVisibility(false)
        }, 4000)
        return () => clearTimeout(timeoutId);

      }
  }, [flashVisibility])

    useEffect(()=>{
        if(getAccess()) console.log(`You're already authenticated. Still want to procceed to login page?`)
    }, [])

    const togglePasswordVisibility = ()=>{
        setVisiblePassword((prevState)=> !prevState)
    }

    const handleKeyPress = (e: any) => {
      if(e.key === 'Enter') send()
    }

    const send = async ()=>{
        deleteCookie('access_token')
        setLoading(true)
        try{
            const {data} = await axios.post('http://localhost:3000/auth/signin', {email, password})
            setAccess(data.access_token)
            return navigate('/chat')
        }
        catch(e: any){
            console.log(e.response.data)
            setFlashMessage(e.response.data.message)
            setFlashVisibility(true)
        }
        finally{
          setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center h-screen bg-gradient-to-br from-white to-gray-200 gradient-bg-welcome'>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat flex flex-col justify-center md:items-center' style={{ backgroundImage: 'url("src/assets/bg.jpg")'}}>
                {loading? <Spinner/>: (
                  <div className="mx-2 md:w-1/3 max-w-md p-6 bg-white rounded-md shadow-md animation-example !buraito">
                  <h1 className='font-bold mb-4 text-2xl'>Sign in</h1>
                  <input
                  className='w-full p-2 mb-4 border border-gray-300 rounded'
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  data-message-required="Please enter your email address"
                  data-message-email="Please enter a VALID email address"
                  onKeyDown={(e)=>{handleKeyPress(e)}}
                  placeholder='E-mail'
                  />
                  <div className="relative">
                    <input
                    placeholder='Password'
                    className='w-full p-2 mb-4 border border-gray-300 rounded relative'
                    type={visiblePassword ? 'text':'password'}
                    name="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    data-minlength="3"
                    data-maxnlength="20"
                    data-message="Please enter your password"
                    onKeyDown={(e)=>{handleKeyPress(e)}}
                    />
                    
                    <button
                      className="absolute top-3 right-0 flex items-center px-4 text-gray-600 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {visiblePassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                      </button>
                  </div>
                  
                  
          <button className='w-full bg-green-500 text-white p-2 mt-4 rounded hover:bg-green-600' type='submit' onClick={()=>{send()}}>Sign in</button>
                      </div>
                )}
            </div>
            <div className="fixed bottom-0 right-0 p-4">
                        {(flashMessage && flashVisibility) ? (<div className="animation-example bg-red-100 border border-red-400 text-red-700 max-w-sm w-full shadow-lg rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold ">{flashMessage}</p>
                            <button className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none" onClick={()=>{setFlashVisibility(false)}}>
                              <svg className="hover:scale-110 fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </button>
                          </div>
                        </div> ) : null }
            </div>
        </div>
    )







}


export default Login