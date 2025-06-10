import { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { FamilyScreen } from './FamilyScreen';
import { TabBar } from './TabBar';
import { MainScreen } from './MainScreen';
import './App.css';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [tab, setTab] = useState<'main' | 'results' | 'family'>('main');

  console.log('App render:', { userName, familyId });

  if (!userName) {
    return <LoginScreen onLogin={setUserName} />;
  }
  if (!familyId) {
    return <FamilyScreen onSelect={(id, _isNew) => setFamilyId(id)} />;
  }

  return (
    <div>
      <TabBar selected={tab} onSelect={(t) => setTab(t as 'main' | 'results' | 'family')} />
      <div style={{ padding: 24 }}>
        {tab === 'main' && <MainScreen userName={userName} />}
        {tab === 'results' && <div>Risultati raggiunti (prossimamente)</div>}
        {tab === 'family' && <div>Gestione famiglia (prossimamente)</div>}
      </div>
    </div>
  );
}

// Funzione compatibile per UUID
export function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default App;
