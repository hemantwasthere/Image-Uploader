import Head from 'next/head'
import ImageUploader from '../components/ImageUploader'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

    <ImageUploader/>


    
    </div>
  )
}
