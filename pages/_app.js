import Navbar from '../components/Navbar'
import { UserContextProvider } from '../context/userContext'
import '../styles/globals.css'
import 'font-awesome/css/font-awesome.min.css'

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>

      <Component {...pageProps} />
      <Navbar />
    </UserContextProvider>
  )
}

export default MyApp
