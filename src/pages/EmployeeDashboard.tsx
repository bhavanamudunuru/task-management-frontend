import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import RoleBadge from '../components/RoleBadge';

const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  created_by: string;
  status: string;
  note: string;
}

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function EmployeeDashboard({ user, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  function showSuccess(msg: string) { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  function showError(msg: string) { setError(msg); setTimeout(() => setError(''), 3000); }

  async function authHeaders() {
    const token = await user.getIdToken();
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }

  async function fetchTasks() {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${BASE}/tasks`, { headers });
      const data = await res.json();
      setTasks(data.data || []);
    } catch (err: any) {
      showError('Failed to load tasks. Make sure the backend is running.');
    }
  }

  async function handleStatusChange(taskId: string, status: string) {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${BASE}/tasks/${taskId}`, { method: 'PUT', headers, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      showSuccess('Task updated!');
      fetchTasks();
    } catch (err: any) {
      showError(err.message);
    } finally { setLoading(false); }
  }

  async function handleSaveNote(taskId: string, note: string) {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${BASE}/tasks/${taskId}`, { method: 'PUT', headers, body: JSON.stringify({ note }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      showSuccess('Note saved!');
      fetchTasks();
    } catch (err: any) {
      showError(err.message);
    } finally { setLoading(false); }
  }

  // Employees cannot delete tasks, this is a no-op kept only to satisfy TaskCard's shared prop shape
  function handleDelete() {}

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6FB', padding: '32px 20px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color:'#1A1A2E', letterSpacing: '-0.02em' }}>Taskboard</h1>
            <p style={{ color:'#888780', fontSize: '0.85rem', marginTop: '2px' }}>
              Your assigned tasks · {user.displayName}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <RoleBadge role="employee" />
            <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid #2A3040', color: '#7C8295', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Log out
            </button>
          </div>
        </div>

        {success && (<div style={{ background: '#0F2A23', border: '1px solid #1F5C4A', color: '#00D9A0', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', textAlign: 'center', fontSize: '0.9rem' }}>{success}</div>)}
        {error && (<div style={{ background: '#2A1318', border: '1px solid #5C2530', color: '#FF6B81', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>)}

        <div style={{ background: '#fff', border: '1px solid #ECEAF6', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#F4F5F7' }}>Your tasks ({tasks.length})</h2>
            <button onClick={fetchTasks} style={{ background: 'transparent', border: '1px solid #2A3040', color: '#7C8295', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Refresh</button>
          </div>

          {tasks.length === 0 ? (
            <p style={{ color: '#7C8295', textAlign: 'center', padding: '40px 0', fontSize: '0.9rem' }}>No tasks assigned to you yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  role="employee"
                  loading={loading}
                  onStatusChange={handleStatusChange}
                  onSaveNote={handleSaveNote}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
