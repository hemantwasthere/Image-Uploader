import { useTheme } from 'next-themes'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ImageUploader from '../components/ImageUploader'
import Navbar from '../components/Navbar'

export default function Home() {


  const { theme, setTheme } = useTheme()

  return (
    <div>
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.webp" />
      </Head>


      <Navbar theme={theme} setTheme={setTheme} />
      <ToastContainer />
      <ImageUploader theme={theme} setTheme={setTheme} />


    </div>
  )
}