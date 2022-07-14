import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../firebase'
import { addDoc, collection, deleteDoc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'
import ArticleDelete from './ArticleDelete'
import { useAuthState } from 'react-firebase-hooks/auth'
import Link from 'next/link'
import LikeArticles from './LikeArticles'


const ImageUploader = () => {

    const [user] = useAuthState(auth)

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
        }, (err) => { console.log(err); }, () => {
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
                    createdAt: Timestamp.now().toDate(),
                    createdBy: user.displayName,
                    userId: user.uid,
                    likes: [],
                    comments: [],
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



    return (
        <>

            {user ? <>
                <div className="flex justify-center fixed top-28">
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
                                    <input name='image' onChange={(e) => handleImageChange(e)} type="file" className="opacity-0" />
                                </label>
                            </div>
                        </div>

                        <div className="p-2">
                            <label htmlFor="text" className="leading-7 text-sm text-gray-600">Title</label>
                            <input onChange={(e) => handleChange(e)} value={formData.title} type="text" id="title" name="title" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>

                        <div className="p-2">
                            <label htmlFor="text" className="leading-7 text-sm text-gray-600">Description</label>
                            <textarea onChange={(e) => handleChange(e)} value={formData.description} type="text" id="description" name="description" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>

                        <div className="flex justify-center flex-col p-2">
                            {formData.image?.name ? <p>{formData.image?.name}</p> : <p>No file selected</p>}
                            <button onClick={handlePublish} className="w-full my-2 px-4 py-2 text-white bg-blue-500 rounded shadow-xl">Upload</button>
                        </div>
                    </div>
                </div>
            </>
                :
                <div className='mt-28 ml-28 text-lg ' >
                    <Link href='/login'><p className='cursor-pointer text-gray-600 my-3 '>Login to post article</p></Link>
                    <Link href='/signup'><p className='cursor-pointer text-gray-600 my-3 '>Dont have an account?</p></Link>
                </div>

            }


            <div className='flex flex-col mx-auto justify-center items-center'>

                {articles.length > 0 && <p className='mt-8 text-xl py-3 text-gray-700 tracking-wider'>Your articles</p>}

                <div className=''>
                    {articles.map(({ id, title, description, imageUrl, createdAt, createdBy, userId, likes, comments }) => {
                        return <div key={id} className='flex flex-col '>
                            <div className='row'>
                                <Link href={`/article/${id}`}>
                                <div className='' >
                                    <img className='h-[180px] w-[180px] ' src={imageUrl} alt="imageUrl" />
                                </div>
                                </Link>
                                <div className='pl-3' >
                                    <div>
                                        <div>
                                            {createdBy && (
                                                <p className='text-gray-700 text-sm'>{createdBy}</p>
                                            )}
                                        </div>
                                        {user && user.uid === userId && (
                                            <ArticleDelete id={id} imageUrl={imageUrl} />
                                        )}
                                    </div>
                                    <h2>{title}</h2>
                                    <p>{createdAt.toDate().toDateString()}</p>
                                    <h4>{description}</h4>
                                    { user && <LikeArticles id={id} likes={likes} />}
                                </div>
                            </div>
                        </div>
                    })
                    }
                </div>
            </div>


        </>

    )
}

export default ImageUploader