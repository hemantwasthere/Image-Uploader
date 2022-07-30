import { UserContextProvider } from '../context/userContext'
import '../styles/globals.css'
import 'font-awesome/css/font-awesome.min.css'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
