import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import useAuthStore from './store/authStore';

export default function App() {
  const getMe = useAuthStore((state) => state.getMe);

  // Rehydrate auth on app load
  useEffect(() => {
    getMe();
  }, []);

  return <AppRouter />;
}
