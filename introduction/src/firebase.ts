import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

// 1. Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2. Prevent duplicate app initialization during hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// 4. Todo Type Interface
export interface Todo {
  id?: string;
  text: string;
  completed: boolean;
  createdAt?: any;
}

// 5. Firestore Helper Functions for User Todos
export const addTodo = async (text: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to add a todo.");

  const todosRef = collection(db, "users", user.uid, "todos");
  return await addDoc(todosRef, {
    text,
    completed: false,
    createdAt: serverTimestamp(),
  });
};

export const getTodos = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to fetch todos.");

  const todosRef = collection(db, "users", user.uid, "todos");
  const snapshot = await getDocs(todosRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Todo[];
};

export const toggleTodo = async (todoId: string, currentStatus: boolean) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to update a todo.");

  const todoRef = doc(db, "users", user.uid, "todos", todoId);
  return await updateDoc(todoRef, {
    completed: !currentStatus,
  });
};

export const deleteTodo = async (todoId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to delete a todo.");

  const todoRef = doc(db, "users", user.uid, "todos", todoId);
  return await deleteDoc(todoRef);
};

export default app;