import React, { useState } from 'react';

interface TaskFormProps {
  onCreate: (title: string, description: string, assignedTo: string) => Promise<void>;
  loading: boolean;
}

export default function TaskForm({ onCreate, loading }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const inputStyle: React.CSSProperties = {
    background: '#FAFAFC', border: '1px solid #E4E2EE', color: '#1A1A2E',
    padding: '10px 14px', borderRadius: '9px', fontSize: '0.92rem', outline: 'none', width: '100%',
  };
  const btnPrimary: React.CSSProperties = {
    background: '#534AB7', color: '#fff', border: 'none',
    padding: '10px 22px', borderRadius: '9px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onCreate(title, description, assignedTo);
    setTitle('');
    setDescription('');
    setAssignedTo('');
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #ECEAF6', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 2px rgba(20,20,30,0.03)' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '16px' }}>Create a new task</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          <input style={inputStyle} placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <input style={inputStyle} placeholder="Assign to (employee's email)" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} style={btnPrimary}>{loading ? 'Creating…' : 'Create task'}</button>
      </form>
    </div>
  );
}