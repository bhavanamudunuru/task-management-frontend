import React from 'react';

interface RoleBadgeProps {
  role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const isManager = role === 'manager';
  return (
    <span style={{
      background: isManager ? '#EEEDFE' : '#E1F5EE',
      color: isManager ? '#3C3489' : '#085041',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.78rem',
      fontWeight: 500,
    }}>
      {isManager ? 'Manager' : 'Employee'}
    </span>
  );
}