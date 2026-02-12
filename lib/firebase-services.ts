import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Subscribe to newsletter.
 * Works with existing Firestore rules: collection "newsletter_subscribers"
 */
export async function subscribeNewsletter(
  email: string,
  locale: string
): Promise<{ success: boolean; alreadySubscribed?: boolean; error?: string }> {
  try {
    await addDoc(collection(db, 'newsletter_subscribers'), {
      email: email.toLowerCase().trim(),
      locale,
      subscribedAt: serverTimestamp(),
      active: true,
    })
    return { success: true }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'Failed to subscribe' }
  }
}

/**
 * Send contact message.
 * Works with existing Firestore rules: collection "contact_messages"
 */
export async function sendContactMessage(data: {
  name: string
  email: string
  subject: string
  message: string
  locale: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, 'contact_messages'), {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      locale: data.locale,
      sentAt: serverTimestamp(),
      read: false,
    })
    return { success: true }
  } catch (error) {
    console.error('Contact message error:', error)
    return { success: false, error: 'Failed to send message' }
  }
}
