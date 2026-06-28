import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
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

export default function ManagerDashboard({ user, onLogout }: DashboardProps) {
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

  async function handleCreate(title: string, description: string, assignedTo: string) {
    if (!title.trim() || !assignedTo.trim()) {
      showError('Title and assigned employee email are required.');
      return;
    }
    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${BASE}/tasks`, {
        method: 'POST', headers,
        body: JSON.stringify({ title: title.trim(), description: description.trim(), assigned_to: assignedTo.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      showSuccess('Task created.');
      fetchTasks();
    } catch (err: any) {
      showError(err.message);
    } finally { setLoading(false); }
  }

  async function handleStatusChange(taskId: string, status: string) {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${BASE}/tasks/${taskId}`, { method: 'PUT', headers, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      showSuccess('Task updated.');
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
      showSuccess('Note saved.');
      fetchTasks();
    } catch (err: any) {
      showError(err.message);
    } finally { setLoading(false); }
  }

  async function handleDelete(taskId: string) {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${BASE}/tasks/${taskId}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      showSuccess('Task deleted.');
      fetchTasks();
    } catch (err: any) {
      showError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6FB', padding: '32px 20px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '1rem' }}>T</div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1A1A2E', letterSpacing: '-0.01em' }}>Taskboard</h1>
              <p style={{ color: '#888780', fontSize: '0.82rem' }}>{user.displayName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <RoleBadge role="manager" />
            <button onClick={onLogout} style={{ background: '#fff', border: '1px solid #E4E2EE', color: '#5F5E5A', padding: '8px 16px', borderRadius: '9px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Log out
            </button>
          </div>
        </div>

        {success && (<div style={{ background: '#EAF3DE', color: '#27500A', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem' }}>{success}</div>)}
        {error && (<div style={{ background: '#FAECE7', color: '#712B13', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem' }}>{error}</div>)}

        <TaskForm onCreate={handleCreate} loading={loading} />

        <div style={{ background: '#fff', border: '1px solid #ECEAF6', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 2px rgba(20,20,30,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>All tasks ({tasks.length})</h2>
            <button onClick={fetchTasks} style={{ background: 'none', border: '1px solid #E4E2EE', color: '#7C7B92', padding: '6px 14px', borderRadius: '7px', cursor: 'pointer', fontSize: '0.8rem' }}>Refresh</button>
          </div>

          {tasks.length === 0 ? (
            <p style={{ color: '#B4B2A9', textAlign: 'center', padding: '40px 0', fontSize: '0.9rem' }}>No tasks created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  role="manager"
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