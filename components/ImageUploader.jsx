import React, { useEffect, useState } from 'react'
import { db, storage } from '../firebase'
import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'
import ArticleDelete from './ArticleDelete'
import { Progress } from '@mantine/core';


const ImageUploader = ({ theme }) => {

    const [articles, setArticles] = useState([])
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        createdAt: Timestamp.now().toDate()
    })
    const [progress, setProgress] = useState(0)


    useEffect(() => {
        const articleRef = collection(db, "articles");
        const q = query(articleRef, orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const articles = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setArticles(articles);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handlePublish = () => {
        if (!formData.title || !formData.description || !formData.image) {
            alert("Please fill all the fields");
            return;
        }

        const storageRef = ref(storage, `/images/${Date.now()}${formData.image.name}`);

        const uploadImage = uploadBytesResumable(storageRef, formData.image);
        uploadImage.on("state_changed", (snapshot) => {
            const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progressPercent);
        }, (err) => { console.log(err); },
            () => {
                setFormData({
                    title: "",
                    description: "",
                    image: "",
                });

                getDownloadURL(uploadImage.snapshot.ref).then((url) => {
                    const articleRef = collection(db, "articles");
                    addDoc(articleRef, {
                        title: formData.title,
                        description: formData.description,
                        imageUrl: url,
                        createdAt: Timestamp.now().toDate()
                    }).then(() => {
                        toast("Article added successfully", { type: "success" });
                        setProgress(0);
                    })
                        .catch((err) => {
                            toast("Error adding article", { type: "error" });
                        });
                })
            });
    };

    function truncateString(str, num) {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

    return (
        <main className='grid grid-cols-2  '>
            <div className="flex col-span-1 h-fit fixed ml-40 mt-20">
                <div className={`max-w-2xl rounded-lg shadow-xl ${theme === 'dark' ? 'bg-[#535352]' : 'bg-gray-50'}`}>

                    <div className="m-4">
                        <div className={`inline-block mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>File Upload</div>
                        <div className="flex items-center justify-center w-full">
                            <div
                                className={`flex flex-col w-full h-32 border-4 border-blue-200 border-dashed ${theme === 'dark' ? 'hover:bg-gray-500 hover:border-gray-200' : 'hover:bg-gray-100 hover:border-gray-300'}`}>
                                <div className="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className={`pt-1 text-sm tracking-wider ${theme === 'dark' ? 'text-white group-hover:text-black' : 'text-gray-400 group-hover:text-gray-600'} `}>
                                        Attach a file
                                    </p>
                                </div>
                                <input name='image' onChange={(e) => handleImageChange(e)} type="file" className="opacity-0" />
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <label htmlFor="text" className={`leading-7 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Title</label>
                        <input onChange={(e) => handleChange(e)} value={formData.title} type="text" id="title" name="title" className={`w-full ${theme === 'dark' ? 'bg-[#535352] text-white ' : 'bg-gray-50 text-gray-700 '} rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`} />
                    </div>

                    <div className="p-2">
                        <label htmlFor="text" className={`leading-7 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Description</label>
                        <textarea onChange={(e) => handleChange(e)} value={formData.description} type="text" id="description" name="description" className={`w-full ${theme === 'dark' ? 'bg-[#535352] text-white' : 'bg-gray-50 text-gray-700'} rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`} />
                    </div>

                    <div className="flex justify-center flex-col p-2">
                        {formData.image?.name ? <p>{formData.image?.name}</p> : <p>No file selected</p>}

                        <button onClick={handlePublish} className="w-full my-2 px-4 py-2 text-white hover:bg-[#5e6ac0] bg-[#3f51d8] rounded shadow-xl">

                            {progress > 0 ? <p>
                                <Progress
                                    mt="sm"
                                    size="xl"
                                    radius="xl"
                                    value={progress}
                                    label={`Uploading ${progress}%`}
                                    color="blue"
                                />
                            </p>
                                : 'Upload'}

                        </button>

                    </div>

                </div>
            </div>


            {articles.length > 0 && <p className={`fixed right-[690px] text-xl py-8 top-[80px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-700'} tracking-wider`}>Your Uploads</p>}

            <div className='mt-32 col-span-1 left-[700px] fixed px-5 py-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-black h-[72vh] top-8 scroll-smooth w-fit'>
                <div className=' h-fit '>
                    {articles.map(({ id, title, description, imageUrl, createdAt }) => {
                        return <div key={id} className={`rounded-lg shadow-lg mb-5 overflow-hidden border h-fit w-[500px]  ${theme === 'dark' ? 'bg-[#1F262E]' : 'bg-white'} md:mx-0 lg:mx-0`}>
                            <img className="w-full bg-cover w-[700px] h-[250px]" src={imageUrl} />
                            <div className="px-3 pb-2">
                                <div className="pt-1">
                                    <div className="mb-2 text-sm">
                                        <span className="font-medium mr-2">{truncateString(title, 30)}</span>
                                    </div>
                                </div>
                                <div className="text-sm mb-2 text-gray-400 cursor-pointer flex justify-between font-medium">
                                    <span>{createdAt.toDate().toDateString()}</span>
                                    <span className='text-red-500 cursor-pointer' ><ArticleDelete id={id} imageUrl={imageUrl} /></span>
                                </div>
                                <div className="mb-2">
                                    <div className="mb-2 text-sm">
                                        {truncateString(description, 60)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </main>

    )
}

export default ImageUploader