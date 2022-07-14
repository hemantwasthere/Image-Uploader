import { signOut } from 'firebase/auth'
import Link from 'next/link'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'


const Navbar = () => {

    const [user] = useAuthState(auth)

    return (

        <header className="text-gray-600 body-font fixed top-0 shadow-lg w-full z-50 ">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">

                <Link href={'/'}>
                    <a className=" cursor-pointer flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="ml-3 text-xl">Image Uploader</span>
                    </a>
                </Link>

                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {user &&
                        <>
                            <a className="mr-5 text-gray-900 font-bold">Hello {user.displayName}👋🏼</a>
                            <p className='text-xs'>Signed in as {user.email}</p>
                            <button onClick={() => signOut(auth)} className='bg-blue-500 rounded p-2 text-white mx-3'>Logout</button>
                        </>
                    }
                </nav>
            </div>
        </header>

    )
}

export default Navbar