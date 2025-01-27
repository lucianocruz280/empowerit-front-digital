import { auth, db } from '@/configs/firebaseConfig'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updateEmail,
} from 'firebase/auth'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
  const { email, password } = data
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const customToken = await getCustomToken(userCredential.user.uid)
    return { status: 'success', data: { ...userCredential, customToken } }
  } catch (e) {
    console.error(e)
    return { status: 'failed', e }
  }
}

export async function apiSignUp(data: SignUpCredential) {
  const {
    email,
    password,
    name,
    sponsor,
    sponsor_id,
    position,
    subscription_expires_at = null,
    presenter1,
    presenter2,
  } = data
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const customToken = await getCustomToken(userCredential.user.uid)
    await setDoc(doc(db, 'users/' + userCredential.user.uid), {
      is_admin: false,
      avatar: '',
      name: name,
      email: email,
      position,
      sponsor: sponsor || '',
      sponsor_id: sponsor_id,
      subscription_expires_at,
      action: data.action || '',
      presenter_1: presenter1,
      presenter_2: presenter2,
    })
    return { status: 'success', data: { ...userCredential, customToken } }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
}

export async function getUser(uid: string): Promise<any | null> {
  return getDoc(doc(db, 'users/' + uid)).then((r) => {
    const _data = r.data()
    if (!_data) {
      return null
    }
    return {
      id: r.id,
      ..._data,
    }
  })
}

export async function updateUser(uid: string, data: any): Promise<void> {
  return updateDoc(doc(db, 'users/', uid), data)
}

export const updateEmail_Auth = async (newEmail: string) => {
  const aut = getAuth().currentUser
  return updateEmail(aut, newEmail)
}

export const getCustomToken = async (user_id: string) => {
  const customToken = await fetch(
    `${import.meta.env.VITE_API_URL}/users/getCustomToken?user=${
      user_id
    }`
  ).then((r) => r.text())
  return customToken
}