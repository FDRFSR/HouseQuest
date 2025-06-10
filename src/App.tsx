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

  if (!userName) {
    return <LoginScreen onLogin={setUserName} />;
  }
  if (!familyId) {
    return <FamilyScreen onSelect={(id) => setFamilyId(id)} />;
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

export default App;
