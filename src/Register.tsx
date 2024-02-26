import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import Spinner from './Spinner'

const setAccess = (accessToken: any)=>{
    const cookies = new Cookies()
    cookies.set('access_token', accessToken)
}

function Register(){
    const [flashVisibility, setFlashVisibility] = useState(false)
    const [flashMessage, setFlashMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)

    const [selectedImage, setSelectedImage] = useState<File | null>(null)

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

       if(avatarUrl) send()
    }, [avatarUrl])

    const send = async ()=>{
        try{
            console.log('IS THIS METHOD EVEN BEING CALLED?')
            const {data} = await axios.post(`${import.meta.env.VITE_API_DOMAIN}/auth/register`, {name, email, password, avatarUrl})
            if(data){
                    return navigate('/login')
            } 
        }
        catch(e: any){
            console.log('erro no 2')
            setFlashMessage(e.response.data.message)
            setFlashVisibility(true)
        }
        finally{
            setLoading(false)
        }
    }

    const togglePasswordVisibility = (e:any)=>{
        e.preventDefault()
        setVisiblePassword((prevState)=> !prevState)
    }

    const handleImage = (e: any)=>{
        setSelectedImage(e.target.files[0])
    }

    const reupscaleCloudinary = (url: string)=> {
        const substringToFind = '/upload/'
        const toAppend = 'w_300,h_300,c_fill/'

        const index = url.indexOf(substringToFind)
        if(index !==-1) {
            return url.slice(0, index + substringToFind.length) + toAppend + url.slice(index + substringToFind.length);
        }
        else return url
    }

    const handleImageUpload = async (e: any)=>{
        e.preventDefault()
        setLoading(true)
        const uploadURL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL

        try{
            const formData = new FormData()
            formData.append('file', selectedImage as Blob)
            const res = await axios.post(uploadURL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                params: {
                  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // Replace with your Cloudinary upload preset
                },
              });
              const avatarUrl = reupscaleCloudinary(res.data.secure_url)
              setAvatarUrl(avatarUrl)

        }catch(e: any){
            if(e.response.data.error.message === 'Unsupported source URL: null'){
                setFlashMessage('Submit a valid image')
            }
            else setFlashMessage(e.response.data.error.message)
            setFlashVisibility(true)
        }finally{
            setLoading(false)
        }
    }

    const handleKeyPress = (e: any) => {
        if(e.key === 'Enter') handleImageUpload(e)
      }

    return (
        <>
        <div className='eth-card flex items-center justify-center h-screen bg-gradient-to-br from-white to-gray-200'>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat flex flex-col md:items-center justify-center' style={{ backgroundImage: 'url("src/assets/bg.jpg")' }}>
                
                {loading ? <Spinner/> : (<div className='md:w-1/3 mx-2 max-w-md  p-6 bg-white rounded-md shadow-md animation-example'>
                    <h1 className='font-bold mb-4 text-2xl'>Register</h1>
                    <form onSubmit={()=>(console.log('sent'))} method="post" encType='multipart/form-data'>
                        <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        data-message-required="Please enter your email address"
                        data-message-email="Please enter a VALID email address"
                        className='w-full p-2 mb-4 border border-gray-300 rounded'
                        placeholder='E-mail'
                        onKeyDown={(e)=>{handleKeyPress(e)}}
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
                        
                        
                        <input
                        placeholder='Username'
                        className='w-full p-2 mb-4 border border-gray-300 rounded'
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        data-minlength="3"
                        data-maxnlength="20"
                        data-message="Please enter your name"
                        onKeyDown={(e)=>{handleKeyPress(e)}}
                        />

                        <input className='text-sm text-grey-500
                        file:mr-5 file:py-3 file:px-10
                        file:rounded file:border-0
                        file:text-md file:text-white
                        file:bg-gradient-to-r file:from-green-500 file:to-green-500
                        hover:file:cursor-pointer hover:file:opacity-80' type="file" name="avatar" id="avatar" onChange={(e)=>handleImage(e)}/>
                        <button className='w-full bg-green-500 text-white p-2 mt-4 rounded hover:bg-green-600' onClick={(e)=>handleImageUpload(e)}>Register</button>
                    </form>
                    
                </div> )}
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
    </>
    )







}


export default Register