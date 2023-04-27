import Image from 'next/image'
import React from 'react'
import { FaRegMoon } from 'react-icons/fa'
import { FiSun } from 'react-icons/fi'
import logo from '../public/logo.webp'

const Navbar = ({ theme, setTheme }) => {

    return (
        <div>
            <div className="body-font sticky top-0 shadow-md bg-[#fff] dark:bg-[#101317]">
                <div className="container flex items-center justify-between p-5 md:flex-row">

                    {/* logo  */}
                    <div className={`flex title-font font-medium items-center md:mb-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <div className='w-10 h-10'>
                            <Image src={logo} alt='logo' />
                        </div>
                        <span className="ml-3 text-xl">CloudAge</span>
                    </div>

                    {/* Hello there  */}
                    <div className="md:ml-auto hidden sm:flex flex-wrap items-center text-base justify-center">
                        <div className={`mr-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold`}>Hello there 👋🏼</div>
                    </div>

                    {/* dark mode button  */}
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`border-[2px] ${theme === 'dark' ? 'border-white hover:bg-white' : 'border-black hover:bg-black'} rounded-md p-2 transition-all duration-500 group`}>
                        {theme === 'dark' ? <FaRegMoon className='group-hover:text-black' size={20} /> : <FiSun className='group-hover:text-white' size={20} />}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                    body {
                        background: ${theme === 'dark' ? "#1F262E" : "#fff"};
                    }
                `}
            </style>
        </div>
    )
}

export default Navbar