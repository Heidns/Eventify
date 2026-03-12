import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const bookingsCol = collection(db, 'bookings');

/**
 * Generate a simple hash for QR code (crypto.randomUUID or fallback).
 */
function generateQrHash() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export async function createBooking({ userId, userName, eventId, eventTitle }) {
  // Check for duplicate
  const q = query(bookingsCol, where('userId', '==', userId), where('eventId', '==', eventId));
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error('You have already booked this event');
  }

  const docRef = await addDoc(bookingsCol, {
    userId,
    userName,
    eventId,
    eventTitle,
    bookingDate: Timestamp.now(),
    qrCodeHash: generateQrHash(),
    status: 'confirmed',
  });
  return docRef.id;
}

export async function getUserBookings(userId) {
  const q = query(bookingsCol, where('userId', '==', userId), orderBy('bookingDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getEventBookings(eventId) {
  const q = query(bookingsCol, where('eventId', '==', eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
