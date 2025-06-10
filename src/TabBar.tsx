import { useState } from 'react';

interface TabProps {
  selected: 'main' | 'results' | 'family';
  onSelect: (tab: 'main' | 'results' | 'family') => void;
}

const tabs = [
  { key: 'main', label: 'Principale' },
  { key: 'results', label: 'Risultati raggiunti' },
  { key: 'family', label: 'Famiglia' },
];

export function TabBar({ selected, onSelect }: TabProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, borderBottom: '1px solid #ccc', marginBottom: 24 }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onSelect(tab.key as 'main' | 'results' | 'family')}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            border: 'none',
            borderBottom: selected === tab.key ? '3px solid #646cff' : '3px solid transparent',
            background: 'none',
            color: selected === tab.key ? '#646cff' : '#333',
            cursor: 'pointer',
            fontWeight: selected === tab.key ? 'bold' : 'normal',
            transition: 'color 0.2s, border-bottom 0.2s',
          }}
          aria-current={selected === tab.key ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
