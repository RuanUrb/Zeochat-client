import Footer from './Footer';
import Logo from './assets/icon.png'

const Home = () => {

    return (
        <div className="h-screen flex flex-col relative items-center justify-center gradient-bg-welcome">
            <div className="flex flex-col m-2">
                <div className="justify-center items-center mb-4">
                    <img src={Logo} alt="" className=''/>
                </div>
                <div className="flex mb-4 items-center justify-center">
                    <h1 className='text-4xl ml-3 shining-text'>Zeochat</h1>
                </div>
                <div className="flex flex-col mt-2 items-center">
                    <h1 className='text-white'>Enjoy privacy and anonymity chatting online.</h1>
                <a href="/login">
                    <button className="mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                        Sign in
                    </button>
                </a>
                <a href="/register" className='text-white mt-2'>New here? <span className='underline'>Sign up</span>.</a>
                </div>
            </div>
            
            <Footer/> 

        </div>
    );
  };
  
  export default Home;