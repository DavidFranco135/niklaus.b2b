import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuração oficial Niklaus B2B (MANTIDA ORIGINAL)
const firebaseConfig = {
  apiKey: "AIzaSyBUvwY-e7h0KZyFJv7n0ignpzlMUGJIurU",
  authDomain: "niklaus-b2b.firebaseapp.com",
  projectId: "niklaus-b2b",
  storageBucket: "niklaus-b2b.firebasestorage.app",
  messagingSenderId: "936430517671",
  appId: "1:936430517671:web:6a0f1b86a39621d74c4a82",
  measurementId: "G-3VGKJGWFSY"
};

// Inicialização segura para evitar múltiplos apps
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exportação dos serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicialização do Analytics (apenas em navegadores suportados)
export const analytics = typeof window !== 'undefined' ? 
  isSupported().then(yes => yes ? getAnalytics(app) : null) : 
  null;

export default app;