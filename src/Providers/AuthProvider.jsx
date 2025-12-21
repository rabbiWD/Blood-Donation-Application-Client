import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { app } from '../firebase/firebase.config'
import { AuthContext } from './AuthContext'
// import axios from 'axios'

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // const [role, setRole] = useState('');

  const registerUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const logOut = async () => {
    setLoading(true)
    return signOut(auth)
  }

  const updateUserProfile = (user) => {
    console.log(user)
    return updateProfile(auth.currentUser, {
      displayName: user.displayName,
      photoURL: user.photoURL,
    })
  }

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      console.log('CurrentUser-->', currentUser?.email)
      setUser(currentUser)
      setLoading(false)
    })
    return () => {
      return unsubscribe()
    }
  }, [])

  // Role set
  // useEffect(()=>{
  //   if(!user) return;
  //   axios.get(`http://localhost:3000/user/role/${user.email}`)
  //   .then(res =>{
  //     setRole(res.data.role)
  //   })
  // }, [user])
  // console.log(role)

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    registerUser,
    signIn,
    signInWithGoogle,
    logOut,
    // role,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
