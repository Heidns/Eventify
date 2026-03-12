import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const eventsCol = collection(db, 'events');

export async function getPublishedEvents({ searchTerm = '', category = '', pageSize = 12, lastDoc = null } = {}) {
  let q = query(
    eventsCol,
    where('status', '==', 'published'),
    orderBy('date', 'asc')
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc), limit(pageSize));
  } else {
    q = query(q, limit(pageSize));
  }

  const snapshot = await getDocs(q);
  let events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    events = events.filter(
      (e) =>
        e.title?.toLowerCase().includes(term) ||
        e.description?.toLowerCase().includes(term) ||
        e.location?.toLowerCase().includes(term)
    );
  }

  if (category) {
    events = events.filter((e) => e.category === category);
  }

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  return { events, lastVisible, hasMore: snapshot.docs.length === pageSize };
}

export async function getEventById(id) {
  const snap = await getDoc(doc(db, 'events', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getOrganizerEvents(organizerId) {
  const q = query(eventsCol, where('organizerId', '==', organizerId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createEvent(eventData) {
  const docRef = await addDoc(eventsCol, {
    ...eventData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateEvent(id, eventData) {
  await updateDoc(doc(db, 'events', id), eventData);
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, 'events', id));
}

export const EVENT_CATEGORIES = [
  'Technology',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Music',
  'Art',
  'Hackathon',
  'Other',
];
