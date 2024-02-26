import { useState, useEffect, useRef } from 'react'
import io, {Socket} from 'socket.io-client'
import * as uuid from 'uuid'
import onlineIcon from './assets/online.png'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { FaSignOutAlt } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";

function getCookie(name: string) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return '';
}

const deleteCookie = (cookieName: string)=>{
  const cookies = new Cookies()
  cookies.remove(cookieName)
}



interface Message{
    _id: string,
    name: string,
    text: string,
    date: Date,
    user: User
  }

interface User {
  _id: string,
  name: string,
  avatarUrl: string
}


export default function Chat()
{
    const [text, setText] = useState<string>('')
    const [messages, setMessages] =  useState<Message[]>([])
    const [user, setUser] = useState<User>()
    const [onlineUsers, setOnlineUsers] = useState<User[]>([])
    const [socket, setSocket] = useState<Socket>()
    const [token, setToken] = useState('')  
    const [flashMessage, setFlashMessage] = useState('')
    const [flashVisibility, setFlashVisibility] = useState(true)

    const navigate = useNavigate()

    const isMobile = useMediaQuery({maxWidth: 640})

    const chatContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if(chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);
  

    useEffect(()=>{
      const token = getCookie('access_token')
      setToken(token)
    }, [])

    useEffect(()=>{
      console.log('JUST TESTING THIS SHEISSE')
      if(token){
      const socket = io('http://localhost:3000',{
          auth: {
              token
          }})
          setSocket(socket)
        
          return ()=>{
            socket.disconnect()
          }
        }
    }, [token])

    useEffect(()=>{
        if(socket){
        socket.emit('findAllMessages', {}, (res: Message[])=>{
          setMessages([...messages,...res])
        })
        
        socket.emit('getOnlineUsers', {}, (res: User[])=>{
          console.log(res)
          setOnlineUsers([...onlineUsers, ...res])
        })
        
        socket.on('userAuthenticated', (user: User)=>{
          setUser(user)
        })

        socket.on('newMessage', (res: Message)=>{
            console.log(res)
            setMessages((prevMessages)=>[...prevMessages, res])
        })

        socket.on('joinRoom', (user: User)=>{
          console.log('received a joinroom from ' + user.name)
          setOnlineUsers((currentUsers)=>[...currentUsers, user]) // POSSIBLY FIX THIS LINE
          setFlashMessage(`${user.name} just hopped in.`)
          setFlashVisibility(true)
        })

        socket.on('leaveRoom', (leftUser: User)=>{
          console.log('received a leftroom from ' + leftUser.name)
          setOnlineUsers((currentUsers)=>{
            console.log(currentUsers)

            return currentUsers.filter(user=>{
                if(user.name !== leftUser.name){
                  console.log(user)
                  return user
                }
            })
          })
        })

        return ()=>{
          socket.disconnect()
        }

      }
    }, [socket])

    useEffect(()=>{
        if(flashVisibility){
          const timeoutId = setTimeout(()=>{
            setFlashVisibility(false)
          }, 3000)
          return () => clearTimeout(timeoutId);

        }
    }, [flashVisibility])
    

      const handleTextChange = (e: any)=>{
        setText(e.target.value)
      }

      const sendMessage = ()=>{
        if(text.trim().length === 0) return
        if(socket){
          socket.emit('createMessage', text)
          setText('')
        }
      }

      const signOut = ()=>{
        const y = window.confirm('Do you really want to sign out?')
        if(y){
          deleteCookie('access_token')
          return navigate('/login')
        }
      }

      const handleKeyPress = (e: any) => {
        if(e.key === 'Enter') sendMessage()
      }

      const getRelativeTime = (currentDate: Date, messageDate: Date) => {
        const MS_IN_DAY = 24 * 60 * 60 * 1000;
      
        const currentDay = new Date(currentDate);
        currentDay.setHours(0, 0, 0, 0);
      
        const messageDay = new Date(messageDate);
        messageDay.setHours(0, 0, 0, 0);
      
        const diffInMs = currentDay.getTime() - messageDay.getTime();
      
        if (diffInMs < MS_IN_DAY) {
          return 'today';
        } else if (diffInMs < 2 * MS_IN_DAY) {
          return 'yesterday';
        } else {
          const daysAgo = Math.floor(diffInMs / MS_IN_DAY);
          return `${daysAgo} days ago`;
        }
      };
  
  const application = ()=>{
    return (

      <div className="flex h-screen">
        <div className=" gradient-bg-services flex-column w-1/5 bg-gray-200 h-screen border-r border-blue-300">         
  
          <div className=" h-1/6 flex items-center justify-center">
              <h1 className='font-serif text-3xl text-white' ><a href='/'>Zeochat</a></h1>
          </div>
            
          <div className=" text-white h-5/6 flex flex-col items-center  overflow-y-auto flex-grow-0">
              <h1 className='text-2xl py-3 px-3'>Online Users</h1>
              <div className='flex-column items-center justify-center'>   
                {onlineUsers.map(user=>
                    <div key={uuid.v4()} className="flex items-center">
                      <div className="relative">
                        <img className='py-3 px-3 rounded-full w-16 h-16' src={user.avatarUrl}/>
                        <img src={onlineIcon} className='absolute bottom-0 right-0 mr-2 mb-2 w-4 h-4'/>
                      </div>
                        <p className='ml-3 text-xl text-white inline-block'>{user.name}</p>
                    </div>         
                  )}
              </div>
          </div>
  
        </div>
  
        <div className="flex w-4/5 wallpaper-gradient h-screen justify-center items-center relative" style={{ backgroundImage: 'url("src/assets/chat-bg.jpg")'}}>
              <div className=' w-4/5 h-4/5 justify-center items-center break-words flex-col relative'>
                <div className="h-5/6  p-4 blue-glassmorphism overflow-y-auto scroll-smooth flex-grow-0" ref={chatContainerRef}>
                {messages.map((msg)=>{
                    const actualDate = new Date(msg.date)
                    const currentDate = new Date()
                    const relativeDate = getRelativeTime(currentDate, actualDate)
  
                    return (<div key={uuid.v4()} className="mt-2 ml-8 flex items-center">
                      <img src={msg.user.avatarUrl} className='w-10 h-10 rounded-full mr-4' alt="" />                
                      <p className='text-white' key={uuid.v4()}><span className='font-bold'>{msg.user.name}</span>: {msg.text} <span className='text-white text-sm'><sub>({actualDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}) {relativeDate} </sub></span></p>
                    </div> )
                })}
                </div>
                
              <div className="h-1/6 mt-auto items-center flex justify-center white-glassmorphism bottom-0">
                <input value={text} onChange={(e)=>{handleTextChange(e)}} onKeyDown={(e)=>{handleKeyPress(e)}} placeholder='Type a message!' type="text" className='w-5/6 rounded p-3' />
                <button onClick={()=>{sendMessage()}} className="ml-3 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                  Send
                </button>
              </div>
              </div>
              
            
            <div className="fixed bottom-0 right-0 p-4">
                        {(flashMessage && flashVisibility) ? (<div className="animation-example bg-blue-100 border border-blue-400 text-blue-700 max-w-sm w-full shadow-lg rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold ">{flashMessage}</p>
                            <button className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none" onClick={()=>{setFlashVisibility(false)}}>
                              <svg className="hover:scale-110 fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </button>
                          </div>
                        </div> ) : null }
            </div>
  
            <div className="absolute bottom-0 left-0 p-4">
              <button onClick={()=>{signOut()}} className='text-white text-xl hover:scale-110'>Sign out</button>
            </div>
        </div>
      </div>
        )
  }

  const mobileApplication = ()=>{
    return (
      <div className="flex flex-col h-screen relative bg-center" style={{ backgroundImage: 'url("src/assets/chat-bg.jpg")'}}>
        <div className="mt-1 ml-1 z-10 top-0 left-0 absolute">
        <button onClick={()=>{signOut()}} className='text-white text-xl hover:-scale-110 transform scale-x-[-1]'> <FaSignOutAlt/> </button>
        </div>
        <div className="m-2 blue-glassmorphism rounded h-4/5 overflow-y-auto scroll-smooth flex-grow-0 " ref={chatContainerRef}>
        {messages.map((msg)=>{
                    const actualDate = new Date(msg.date)
                    const currentDate = new Date()
                    const relativeDate = getRelativeTime(currentDate, actualDate)
  
                    return (<div key={uuid.v4()} className="mt-2 ml-2 mb-2 flex items-center">
                      <img src={msg.user.avatarUrl} className='w-10 h-10 rounded-full mr-4' alt="" />                
                      <p className='text-white' key={uuid.v4()}><span className='font-bold'>{msg.user.name}</span>: {msg.text} <span className='text-white text-sm'><sub>({actualDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}) {relativeDate} </sub></span></p>
                    </div> )
                })}
        </div>
        <div className="gradient-bg-transactions flex flex-col bg-red-200 h-1/5">
          <div className=" flex items-center">
            <input value={text} onChange={(e)=>{handleTextChange(e)}} onKeyDown={(e)=>{handleKeyPress(e)}} placeholder='Type a message!' type="text" className='m-2 w-5/6 rounded p-2' />
                  <button onClick={()=>{sendMessage()}} className="mr-1 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                    Send
                  </button>
          </div>
          <div className="flex overflow-x-auto">  
            {onlineUsers.map(user=>
                      <div key={uuid.v4()} className="mx-4 flex-shrink-0 flex flex-col items-center">  
                          <div className="relative">
                            <img className='py-3 px-3 rounded-full w-16 h-16' src={user.avatarUrl}/>
                            <img src={onlineIcon} className='absolute bottom-0 right-0 mr-2 mb-2 w-4 h-4'/>
                          </div>
                          <p className='ml-3 text-xl text-white inline-block'>{user.name}</p>
                      </div>         
            )}
          </div>
          {/*ZEOCHAT LOGO + ONLINE USERS X-SCROLL*/ }
        </div>
      </div>
    )
  }

  const notAuthenticated = ()=>{
    return( 
    
    <div className="flex flex-col h-screen relative bg-center items-center justify-center" style={{ backgroundImage: 'url("src/assets/chat-bg.jpg")'}}>
        <div className="mx-4 relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
  <div className="p-6">
    <BsChatRightText className="w-12 h-12 mb-4 text-gray-900"/>
    <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      Not authenticated
    </h5>
    <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
      Authenticate to join lots of users on Zeochat
    </p>
  </div>
  <div className="p-6 pt-0">
    <a href="/login" className="inline-block">
      <button
        className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
        type="button">
        Sign in
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
          stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
        </svg>
      </button>
    </a>
  </div>
</div> 
    </div>
  )}


  return (socket ? (!isMobile ? application() : mobileApplication()) : notAuthenticated());
}






