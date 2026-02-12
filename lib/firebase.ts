import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyCRT-2FVvWNmLhvW5tuL0yxaNszm4hdT5E',
  authDomain: 'carlosanayaweb.firebaseapp.com',
  projectId: 'carlosanayaweb',
  storageBucket: 'carlosanayaweb.firebasestorage.app',
  messagingSenderId: '986809940601',
  appId: '1:986809940601:web:6258f3c6df4a903f13f2a8',
  measurementId: 'G-SYNV872BVW',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)

export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && (await isSupported())) {
    return getAnalytics(app)
  }
  return null
}

export default app
