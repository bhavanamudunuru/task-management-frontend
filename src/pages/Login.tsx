import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

interface LoginProps {
  onLogin: (user: any, role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState<'manager' | 'employee' | null>(null);
  const [error, setError] = useState('');

  async function handleLogin(intendedRole: 'manager' | 'employee') {
  setLoading(intendedRole);
  setError('');
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const res = await fetch(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const actualRole = data.role;

    // Strict match required: the button clicked must match the account's real role
    if (intendedRole !== actualRole) {
      await signOut(auth);
      if (intendedRole === 'manager') {
        setError("This account isn't registered as a manager. Use the Employee button instead.");
      } else {
        setError("This is a manager account. Use the Manager button instead.");
      }
      setLoading(null);
      return;
    }

    onLogin(result.user, actualRole);
  } catch (err: any) {
    setError('Sign-in failed. Try again.');
  } finally {
    setLoading(null);
  }
}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F4F0FF 0%, #EEF7F4 50%, #FDF4EC 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '24px',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '460px',
        textAlign: 'center',
        boxShadow: '0 1px 2px rgba(20,20,30,0.04), 0 24px 48px -8px rgba(20,20,30,0.12)',
        border: '1px solid #ECEAF6',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: '#534AB7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 22px', color: '#fff', fontSize: '1.4rem', fontWeight: 600,
        }}>T</div>

        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '6px', letterSpacing: '-0.01em' }}>
          Taskboard
        </h1>
        <p style={{ color: '#7C7B92', fontSize: '0.92rem', marginBottom: '30px' }}>
          Choose how you'd like to sign in
        </p>

        {error && (
          <div style={{
            background: '#FAECE7', border: '1px solid #F0997B', color: '#712B13',
            padding: '11px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            onClick={() => handleLogin('manager')}
            disabled={loading !== null}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              padding: '26px 16px', borderRadius: '14px', border: '1.5px solid #CECBF6',
              background: '#F6F4FE', cursor: loading ? 'default' : 'pointer',
              opacity: loading === 'employee' ? 0.45 : 1, transition: 'border-color 0.15s, transform 0.1s',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>👔</div>
            <span style={{ color: '#1A1A2E', fontWeight: 500, fontSize: '0.93rem' }}>
              {loading === 'manager' ? 'Signing in…' : 'Manager'}
            </span>
            <span style={{ color: '#888780', fontSize: '0.75rem' }}>Assign and track</span>
          </button>

          <button
            onClick={() => handleLogin('employee')}
            disabled={loading !== null}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              padding: '26px 16px', borderRadius: '14px', border: '1.5px solid #9FE1CB',
              background: '#F1FBF7', cursor: loading ? 'default' : 'pointer',
              opacity: loading === 'manager' ? 0.45 : 1, transition: 'border-color 0.15s, transform 0.1s',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🙂</div>
            <span style={{ color: '#1A1A2E', fontWeight: 500, fontSize: '0.93rem' }}>
              {loading === 'employee' ? 'Signing in…' : 'Employee'}
            </span>
            <span style={{ color: '#888780', fontSize: '0.75rem' }}>View your tasks</span>
          </button>
        </div>

        <p style={{ color: '#B4B2A9', fontSize: '0.74rem', marginTop: '26px' }}>
          Manager access is limited to registered manager accounts.
        </p>
      </div>
    </div>
  );
}