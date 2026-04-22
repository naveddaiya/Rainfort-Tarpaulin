import { getDb } from '@/config/firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from 'firebase/firestore';

const COL = 'categories';

export const getCategories = async () => {
  const db = await getDb();
  const q = query(collection(db, COL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addCategory = async (data) => {
  const db = await getDb();
  return addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
};

export const updateCategory = async (id, data) => {
  const db = await getDb();
  return updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteCategory = async (id) => {
  const db = await getDb();
  return deleteDoc(doc(db, COL, id));
};
