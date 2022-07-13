import React, { useEffect, useState } from 'react'
import { storage } from '../firebase'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes, } from 'firebase/storage'
import { useUserContext } from '../context/userContext'
import { v4 } from 'uuid'

const ImageUploader = () => {

    const [image, setImage] = useState(null)
    const [imageList, setImageList] = useState([])

    const { user } = useUserContext()

    const userImagesRef = ref(storage, `users/${user.email}/${user.uid}/`)

    const uploadImage = () => {
        if (!image) return;
        const imageRef = ref(storage, `users/${user.email}/${user.uid}/${image.name + v4()}/`)
        uploadBytes(imageRef, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageList((prev) => [...prev, url])
                alert("Image has been uploaded")
            })
        })
    }

    useEffect(() => {
        listAll(userImagesRef).then((res) => {
            res.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url])
                })
            })
        })
    }, [])

    const deleteFromFirebase = (url) => {
        const deleteRef = ref(storage, url)
        deleteObject(deleteRef).then(() => {
            alert("File is deleted successfully!")
        }).catch((err) => {
            console.log(err)
        })
    };

    console.log(imageList)


    return (
        <>
            <div className="flex justify-center mt-8">
                <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">

                    <div className="m-4">
                        <label className="inline-block mb-2 text-gray-500">File Upload</label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                <div className="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                        Attach a file</p>
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" className="opacity-0" />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-center flex-col p-2">
                        {image ? <p>{image?.name}</p> : <p>No file selected</p>}
                        <button onClick={uploadImage} className="w-full my-2 px-4 py-2 text-white bg-blue-500 rounded shadow-xl">Upload</button>
                    </div>

                </div>
            </div>

            <div className='flex flex-col mx-auto justify-center items-center'>
                <p className=' text-xl py-8 text-gray-700 tracking-wider'>Your Images</p>
                <div className=''>
                    {imageList.map((url) => {
                        return <>
                            <img key={url} className='mx-auto m-4 w-[30%] h-[30%] shadow-lg hover:transition hover:scale-105 hover:duration-300' src={url} alt="" />
                            <button onClick={() => deleteFromFirebase(url)}>
                                Delete
                            </button>
                        </>
                    })
                    }
                </div>
            </div>


        </>

    )
}

export default ImageUploader