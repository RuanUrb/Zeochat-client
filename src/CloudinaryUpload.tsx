import React, {useState} from 'react'
import axios from 'axios'


 const CloudinaryUpload = ()=>{
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const handleImage = (e: any)=>{
        setSelectedImage(e.target.files[0])
    }

    const handleImageUpload = async (e: any)=>{
        e.preventDefault()
        const uploadURL = "https://api.cloudinary.com/v1_1/dlwh01eif/auto/upload"

        try{
            const formData = new FormData()
            formData.append('file', selectedImage as Blob)
            const res = await axios.post(uploadURL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                params: {
                  upload_preset: 'ydcpk21t', // Replace with your Cloudinary upload preset
                },
              });
            console.log(res.data)
        }catch(e: any){
            console.log(e.response?.data)
        }
    }

    return (
        <div>
            <input type="file" name="avatar" id="avatar" onChange={(e)=>handleImage(e)}/>
            <button onClick={(e)=>handleImageUpload(e)}>Upload Image to Cloudinary</button>
        </div>
    )
}

export default CloudinaryUpload