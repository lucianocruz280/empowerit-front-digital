import { db } from '@/configs/firebaseConfig'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'

export const createVerificationCode = async (userId, code) => {
  const docRef = doc(db, 'verification_codes', userId)
  try {
    await setDoc(docRef, {
      code: code,
    })
    return true
  } catch (e) {
    return { status: 'error', message: e.message }
  }
}

export const generateOTP = () => {
  const length = 4
  let otp = ''

  otp += Math.floor(Math.random() * 9) + 1

  for (let i = 1; i < length; i++) {
    const digit = Math.floor(Math.random() * 10)
    otp += digit.toString()
  }

  return parseInt(otp)
}

export const verifyCode = async (userId, code) => {
  const docRef = doc(db, 'verification_codes', userId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data().code == code
  }
  return false
}

export const deleteVerificationCode = async (userId) => {
  const docRef = doc(db, 'verification_codes', userId)
  try {
    await deleteDoc(docRef)
  } catch (e) {
    return { status: 'error', message: e.message }
  }
}
