import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const isProd = process.env.NODE_ENV == 'production'
const databaseName = isProd ? '(default)' : 'testing'

const firebaseConfig =
  import.meta.env.VITE_CUSTOM_ENV == 'production'
    ? {
      apiKey: "AIzaSyAWVxEDyNqag3Yn2ZS73dfVODnSAfYlGRA",
      authDomain: "empowerit-top-digital.firebaseapp.com",
      projectId: "empowerit-top-digital",
      storageBucket: "empowerit-top-digital.firebasestorage.app",
      messagingSenderId: "639682139000",
      appId: "1:639682139000:web:61f8ab25bc99692e6eee8d"
    }
    : {
      apiKey: "AIzaSyAWVxEDyNqag3Yn2ZS73dfVODnSAfYlGRA",
      authDomain: "empowerit-top-digital.firebaseapp.com",
      projectId: "empowerit-top-digital",
      storageBucket: "empowerit-top-digital.firebasestorage.app",
      messagingSenderId: "639682139000",
      appId: "1:639682139000:web:61f8ab25bc99692e6eee8d"
    }

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
//export const db = getFirestore(app, databaseName)
export const analytics = getAnalytics(app)
export const storageBucket = getStorage(app)
