import { Progress } from '@mantine/core'
import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { db, storage } from '../firebase'
import ArticleDelete from './ArticleDelete'


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
                        toast("file added successfully", { type: "success" });
                        setProgress(0);
                    })
                        .catch((err) => {
                            toast("Error in adding file", { type: "error" });
                        });
                })
            });
    };

    function truncateString(str, num) {
        if (str?.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

    return (
        <div className='flex flex-col sm:flex-row sm:justify-between '>

            {/* image uploader section  */}
            <div className="flex h-fit sm:w-80 mt-12 mx-auto max-w-2xl">
                {/* <div className=''> */}
                <div className={`mx-auto md:w-80 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-[#535352]' : 'bg-gray-50'}`}>
                    <div className="m-4">

                        {/* file upload  */}
                        <div className={`inline-block mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>
                            File Upload
                        </div>

                        {/* title and desc div  */}
                        <div className="flex items-center justify-center w-full group">
                            <div className={`flex flex-col relative w-full h-32 border-4 border-blue-200 border-dashed ${theme === 'dark' ? 'group-hover:bg-gray-500 group-hover:border-gray-200' : 'group-hover:bg-gray-100 group-hover:border-gray-300'}`}>
                                <div className="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className={`pt-1 text-sm tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-400'} `}>
                                        Attach a file
                                    </span>
                                    <input className="opacity-0 z-50 absolute w-[230px] md:w-[282px] h-full top-[.5px] " name='image' onChange={(e) => handleImageChange(e)} type="file" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* title  */}
                    <div className="p-2">
                        <label htmlFor="text" className={`leading-7 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Title</label>
                        <input onChange={(e) => handleChange(e)} value={formData.title} type="text" id="title" name="title" className={`w-full ${theme === 'dark' ? 'bg-[#535352] text-white ' : 'bg-gray-50 text-gray-700 '} rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`} />
                    </div>

                    {/* description   */}
                    <div className="p-2">
                        <label htmlFor="text" className={`leading-7 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Description</label>
                        <textarea onChange={(e) => handleChange(e)} value={formData.description} type="text" id="description" name="description" className={`w-full ${theme === 'dark' ? 'bg-[#535352] text-white' : 'bg-gray-50 text-gray-700'} rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`} />
                    </div>

                    {/* No file selected or file name  */}
                    <div className="flex justify-center flex-col p-2">
                        {formData.image?.name ? <span>{formData.image?.name}</span> : <span>No file selected</span>}
                        {/* upload button with progress bar  */}
                        <button onClick={handlePublish} className="w-full my-2 px-4 py-2 text-white hover:bg-[#5e6ac0] bg-[#3f51d8] rounded shadow-xl">
                            {progress > 0 ? <span>
                                <Progress
                                    mt="sm"
                                    size="xl"
                                    radius="xl"
                                    value={progress}
                                    label={`Uploading ${progress}%`}
                                    color="blue"
                                />
                            </span>
                                : 'Upload'}
                        </button>
                    </div>

                </div>
                {/* </div> */}
            </div>

            <div className='mx-auto mt-[24px]'>
                {articles.length > 0 ? <p className={` text-xl pl-4 py-4 font-bold tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-700'} `}>All Uploads</p> : <p className={` text-xl pl-4 py-4 font-bold tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-700'} `}>Please Upload any image or gif to see here</p>}
                <div className='px-2 h-[480px] sm:h-[540px] overflow-y-scroll scrollbar-thin scrollbar-thumb-black scroll-smooth'>
                    <div className='h-fit'>
                        {articles.map(({ id, title, description, imageUrl, createdAt }) => {
                            return <div key={id} className="px-2">
                                <div className={`rounded-lg shadow-lg w-[280px] md:w-[400px] lg:w-[550px] mb-5 overflow-hidden border h-fit ${theme === 'dark' ? 'bg-[#1F262E]' : 'bg-white'} md:mx-0 lg:mx-0`}>
                                    {/* post image  */}
                                    <img className="w-full bg-cover h-auto" src={imageUrl} />

                                    <div className="px-3 pb-2">
                                        {/* post title  */}
                                        <div className="my-2 text-sm sm:text-lg">
                                            <span className="font-medium mr-2">{truncateString(title, 30)}</span>
                                        </div>

                                        {/* delete component  */}
                                        <div className="py-1 text-gray-400 cursor-pointer flex items-center justify-between font-medium">
                                            <span className='text-xs sm:text-sm'>{createdAt.toDate().toDateString()}</span>
                                            <span className='text-red-500 cursor-pointer' ><ArticleDelete id={id} imageUrl={imageUrl} /></span>
                                        </div>

                                        {/* post description  */}
                                        <div className="mb-2">
                                            <div className="mb-2 text-xs sm:text-sm">
                                                {truncateString(description, 60)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageUploader