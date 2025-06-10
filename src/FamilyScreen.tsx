import { useState } from 'react';
import { generateFamilyCode } from './App';

interface FamilyProps {
  onSelect: (familyId: string, isNew: boolean) => void;
}

export function FamilyScreen({ onSelect }: FamilyProps) {
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'choose' | 'join' | 'create'>('choose');
  const [newFamilyId] = useState(() => generateFamilyCode());

  if (step === 'choose') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 80 }}>
        <h2>Famiglia</h2>
        <button onClick={() => setStep('create')} style={{ padding: '8px 24px', fontSize: 18 }}>Crea nuova famiglia</button>
        <button onClick={() => setStep('join')} style={{ padding: '8px 24px', fontSize: 18 }}>Unisciti con codice</button>
      </div>
    );
  }

  if (step === 'create') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 80 }}>
        <h3>Nuova famiglia creata!</h3>
        <button onClick={() => {
          console.log('Bottone Continua premuto', newFamilyId);
          onSelect(newFamilyId, true);
        }} style={{ padding: '8px 24px', fontSize: 18 }}>Continua</button>
      </div>
    );
  }

  // join
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 80 }}>
      <h3>Inserisci codice famiglia</h3>
      <input
        type="text"
        placeholder="Codice famiglia"
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ padding: 8, fontSize: 18 }}
      />
      <button
        onClick={() => {
          if (code.trim()) {
            console.log('Bottone Unisciti premuto', code.trim());
            onSelect(code.trim(), false);
          }
        }}
        style={{ padding: '8px 24px', fontSize: 18 }}
        disabled={!code.trim()}
      >
        Unisciti
      </button>
    </div>
  );
}
