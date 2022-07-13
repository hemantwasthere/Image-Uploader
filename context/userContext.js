import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, res => {
            res ? setUser(res) : setUser(null)
            setError("")
        })
        return () => unsubscribe()
    }, [])


    const registerUser = async (name, email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password).then(() => {
            updateProfile(auth.currentUser, {
                displayName: name
            })
        })
    }

    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logoutUser = () => {
        return signOut(auth)
    }

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }
    
    const contextValue = {
        user,
        error,
        registerUser,
        signInUser,
        logoutUser,
        forgotPassword,
        setError,
    }

    return <UserContext.Provider value={contextValue} >
        {children}
    </UserContext.Provider>
}