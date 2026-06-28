import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(true);

  // Watch Firebase auth state on initial app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function handleLogin(loggedInUser: any, userRole: string) {
    setUser(loggedInUser);
    setRole(userRole);
  }

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    setRole('');
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0B0E14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#7C8295', fontFamily: "'Inter', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  if (!user || !role) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === 'manager') {
    return <ManagerDashboard user={user} onLogout={handleLogout} />;
  }

  return <EmployeeDashboard user={user} onLogout={handleLogout} />;
}
