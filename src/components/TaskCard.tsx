import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  created_by: string;
  status: string;
  note: string;
}

interface TaskCardProps {
  task: Task;
  role: string;
  loading: boolean;
  onStatusChange: (taskId: string, status: string) => void;
  onSaveNote: (taskId: string, note: string) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#F1EFE8', text: '#5F5E5A' },
  in_progress: { bg: '#FAEEDA', text: '#854F0B' },
  completed: { bg: '#EAF3DE', text: '#3B6D11' },
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

export default function TaskCard({ task, role, loading, onStatusChange, onSaveNote, onDelete }: TaskCardProps) {
  const [noteText, setNoteText] = useState(task.note);
  const statusStyle = STATUS_STYLE[task.status];

  const inputStyle: React.CSSProperties = {
    background: '#FAFAFC', border: '1px solid #E4E2EE', color: '#1A1A2E',
    padding: '9px 13px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', flex: 1,
  };
  const btnPrimary: React.CSSProperties = {
    background: '#534AB7', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.8rem',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #ECEAF6', borderRadius: '14px', padding: '18px', boxShadow: '0 1px 2px rgba(20,20,30,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '10px' }}>
        <div>
          <h3 style={{ color: '#1A1A2E', fontSize: '0.96rem', fontWeight: 600, marginBottom: '3px' }}>{task.title}</h3>
          {task.description && <p style={{ color: '#888780', fontSize: '0.84rem' }}>{task.description}</p>}
        </div>
        <span style={{
          background: statusStyle.bg, color: statusStyle.text,
          padding: '4px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 500, whiteSpace: 'nowrap',
        }}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      <p style={{ color: '#B4B2A9', fontSize: '0.78rem', marginBottom: '14px' }}>
        {role === 'manager' ? `Assigned to ${task.assigned_to}` : `Created by ${task.created_by}`}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {['pending', 'in_progress', 'completed'].map(s => {
          const active = task.status === s;
          const sStyle = STATUS_STYLE[s];
          return (
            <button
              key={s}
              onClick={() => onStatusChange(task.id, s)}
              disabled={loading || active}
              style={{
                background: active ? sStyle.bg : '#fff',
                color: active ? sStyle.text : '#7C7B92',
                border: `1px solid ${active ? 'transparent' : '#E4E2EE'}`,
                padding: '6px 13px', borderRadius: '8px', cursor: active ? 'default' : 'pointer',
                fontSize: '0.78rem', fontWeight: 500,
              }}
            >
              {STATUS_LABELS[s]}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={inputStyle}
          placeholder="Add a note about progress…"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
        />
        <button onClick={() => onSaveNote(task.id, noteText)} disabled={loading} style={btnPrimary}>Save</button>
      </div>

      {role === 'manager' && (
        <button
          onClick={() => onDelete(task.id)}
          style={{ background: 'none', border: 'none', color: '#D85A30', padding: '6px 0 0', cursor: 'pointer', fontSize: '0.78rem', marginTop: '10px', fontWeight: 500 }}
        >
          Delete task
        </button>
      )}
    </div>
  );
}