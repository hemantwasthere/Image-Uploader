import Link from 'next/link'
import React from 'react'

const Signin = () => {
  return (
    <section className="text-gray-600 body-font mx-auto flex justify-center items-center ">
        <div className="container px-5 py-24 flex justify-center items-center">

            <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col  w-full mt-10 md:mt-0">

                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign In</h2>

                <div className=" mb-4">
                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                    <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>

                <div className=" mb-4">
                    <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                    <input type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>

                <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Sign In</button>

                <Link href={'/signup'}>
                    <p className='text-sm text-blue-600 my-6 cursor-pointer'>Dont have an account yet? Sign Up </p>
                </Link>

            </div>
        </div>
    </section>
  )
}

export default Signin