import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState()
    const [error, setError] = useState("")

    const router = useRouter()

    useEffect(() => {
        setLoading(true)
        const unsubscribe = onAuthStateChanged(auth, res => {
            res ? setUser(res) : setUser(null)
            setError("")
            setLoading(false)
        })
        // return unsubscribe
        return () => unsubscribe()
    }, [])


    const registerUser = (name, email, password) => {
        setLoading(true)
        // createUserWithEmailAndPassword(auth, email, password)
        //     .then(() => {
        //         return updateProfile(auth.currentUser, {
        //             displayName: name
        //         })
        //     })
        //     .then(res => console.log(res))
        //     .catch(err => setError(err.message))
        //     .finally(setLoading(false))

        return createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name
                })
            }).finally(setLoading(false))
    }

    const signInUser = (email, password) => {
        setLoading(true)
        // signInWithEmailAndPassword(auth, email, password)
        //     .then(res => console.log(res))
        //     .catch(err => setError(err.message))
        //     .finally(setLoading(false))
        return signInWithEmailAndPassword(auth, email, password).finally(setLoading(false))

    }

    const logoutUser = () => {
        return signOut(auth)
    }

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const contextValue = {
        user,
        loading,
        error,
        registerUser,
        signInUser,
        logoutUser,
        forgotPassword,
        setError
    }

    return <UserContext.Provider value={contextValue} >
        {children}
    </UserContext.Provider>
}