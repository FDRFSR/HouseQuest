import { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

export function LoginScreen({ onLogin }: LoginProps) {
  const [name, setName] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 80 }}>
      <h2>Benvenuto!</h2>
      <input
        type="text"
        placeholder="Inserisci il tuo nome"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: 8, fontSize: 18 }}
      />
      <button
        onClick={() => {
          if (name.trim()) {
            console.log('LoginScreen: onLogin chiamato con', name.trim());
            onLogin(name.trim());
          }
        }}
        style={{ padding: '8px 24px', fontSize: 18 }}
        disabled={!name.trim()}
      >
        Avanti
      </button>
    </div>
  );
}
