const Error = ()=>{
    return (

<div className=" h-screen flex items-center justify-center" style={{ backgroundImage: 'url("src/assets/chat-bg.jpg")'}}>
    <div className="footer-glassmorphism p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-8">404 - Page Not Found</h1>
        <p className="text-gray-200 mb-6">This page isn't available or doesn't exist. </p>
        <a href="/login" className="inline-block py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">Back</a>
    </div>
</div>
    )
}

export default Error