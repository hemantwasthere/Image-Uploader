import Image from 'next/image'
import React from 'react'
import logo from '../public/logo.webp'
import { FaRegMoon } from 'react-icons/fa'
import { FiSun } from 'react-icons/fi'

const Navbar = ({ theme, setTheme }) => {

    return (
        <>
            <header className="body-font sticky top-0 shadow-md bg-[#fff] dark:bg-[#101317] ">
                <div className="container mx-auto flex flex-wrap px-5 py-3 flex-col md:flex-row items-center">
                    <a className={`flex title-font font-medium items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 md:mb-0`}>
                        <div className='w-14 h-14'><Image src={logo} alt='' /></div>
                        <span className="ml-3 text-xl">CloudImage</span>
                    </a>
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <a className={`mr-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold`}>Hello there 👋🏼</a>
                    </nav>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`border-[2px] ${theme === 'dark' ? 'border-white hover:bg-white' : 'border-black hover:bg-black'} rounded-md p-2 transition-all duration-500 group`}>
                        {theme === 'dark' ? <FaRegMoon className='group-hover:text-black' size={20} /> : <FiSun className='group-hover:text-white z-50' size={20} />}
                    </button>
                </div>
            </header>

            <style jsx global>{`
        body {
          background: ${theme === 'dark' ? "#1F262E" : "#fff"};
        }
      `}</style>
        </>
    )
}

export default Navbar