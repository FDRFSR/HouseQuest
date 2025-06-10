import { useState, useEffect } from 'react';
import { LoginScreen } from './LoginScreen';
import { FamilyScreen } from './FamilyScreen';
import { TabBar } from './TabBar';
import { MainScreen } from './MainScreen';
import { FamilyTab } from './FamilyTab';
import './App.css';
import type { Task } from './MainScreen';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, deleteField } from 'firebase/firestore';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [tab, setTab] = useState<'main' | 'results' | 'family'>('main');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || uuidv4());
  const [familyMembers, setFamilyMembers] = useState<{ id: string; name: string }[]>([]);

  // Recupera stato persistente da localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    const savedFamilyId = localStorage.getItem('familyId');
    if (savedUserId) setUserId(savedUserId);
    if (savedUserName) setUserName(savedUserName);
    if (savedFamilyId) setFamilyId(savedFamilyId);
  }, []);

  // Salva userId, userName, familyId su localStorage
  useEffect(() => {
    if (userId) localStorage.setItem('userId', userId);
    if (userName) localStorage.setItem('userName', userName);
    if (familyId) localStorage.setItem('familyId', familyId);
  }, [userId, userName, familyId]);

  // Sync membri famiglia da Firestore (più compatto e tipizzato)
  useEffect(() => {
    if (!familyId) return;
    const unsub = onSnapshot(doc(db, 'families', familyId), (snap) => {
      const members = snap.data()?.members;
      let entries: { id: string; name: string }[] = [];
      if (members && typeof members === 'object') {
        entries = Object.entries(members)
          .filter(([, name]) => typeof name === 'string' && name.trim())
          .map(([id, name]) => ({ id, name: String(name) }));
      }
      if (userId && userName && !entries.some(m => m.id === userId)) {
        entries.push({ id: userId, name: userName });
      }
      setFamilyMembers(entries);
    });
    return unsub;
  }, [familyId, userId, userName]);

  // All'ingresso in famiglia, aggiungi/aggiorna membro
  useEffect(() => {
    if (!familyId || !userName) return;
    const ref = doc(db, 'families', familyId);
    getDoc(ref).then(snap => {
      if (!snap.exists()) {
        setDoc(ref, { members: { [userId]: userName } });
      } else {
        updateDoc(ref, { [`members.${userId}`]: userName });
      }
    });
  }, [familyId, userName, userId]);

  // Cambio nome: aggiorna solo la propria entry
  const handleChangeName = (name: string) => {
    setUserName(name);
    if (familyId) {
      const ref = doc(db, 'families', familyId);
      updateDoc(ref, { [`members.${userId}`]: name });
    }
  };

  // Uscita dalla famiglia: rimuovi la propria entry
  const handleLeaveFamily = () => {
    if (familyId) {
      const ref = doc(db, 'families', familyId);
      updateDoc(ref, { [`members.${userId}`]: deleteField() });
    }
    setFamilyId(null);
    setUserName(null);
    setTasks([]);
  };

  // DEBUG: aggiungi membri mock se la famiglia è nuova e c'è solo l'utente corrente
  useEffect(() => {
    if (
      familyMembers.length === 1 &&
      familyMembers[0].id === userId &&
      familyId &&
      userName &&
      process.env.NODE_ENV !== 'production'
    ) {
      const ref = doc(db, 'families', familyId);
      const mockMembers = [
        { id: 'mock1', name: 'Alice' },
        { id: 'mock2', name: 'Bob' },
        { id: 'mock3', name: 'Carla' },
      ];
      mockMembers.forEach(m => {
        updateDoc(ref, { [`members.${m.id}`]: m.name });
      });
    }
  }, [familyMembers, familyId, userId, userName]);

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
        {tab === 'main' && <MainScreen tasks={tasks} setTasks={setTasks} />}
        {tab === 'results' && (
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 18 }}>
            <h2 style={{ fontSize: 22, margin: '0 0 12px 0', color: '#4caf50' }}>🏆 Risultati di oggi</h2>
            <div style={{ fontSize: 15, color: '#888', marginBottom: 18 }}>{new Date().toLocaleDateString()}</div>
            {tasks.filter(t => t.done).length === 0 ? (
              <div style={{ color: '#aaa', fontSize: 17, textAlign: 'center', margin: '32px 0' }}>
                Nessuna task completata oggi.<br />Inizia a completare le attività per guadagnare punti!
              </div>
            ) : (
              <>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tasks.filter(t => t.done).map(task => (
                    <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 17, background: '#eaffea', borderRadius: 8, padding: '8px 6px', color: '#222', fontWeight: 500 }}>
                      <span style={{ fontSize: 20 }}>{/* emoji */} {task.text && (task.text.match(/\p{Emoji}/gu) ? task.text.match(/\p{Emoji}/gu)![0] : '') || ''}{/* fallback */}{task.emoji || ''}</span>
                      <span style={{ flex: 1 }}>{task.text}</span>
                      <span style={{ color: '#388e3c', fontWeight: 700, fontSize: 16 }}>+{task.points}pt</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: '1px solid #e0e0e0', margin: '18px 0 0 0', paddingTop: 12, textAlign: 'right', fontSize: 18, fontWeight: 700, color: '#388e3c' }}>
                  Totale: +{tasks.filter(t => t.done).reduce((sum, t) => sum + t.points, 0)} pt
                </div>
              </>
            )}
          </div>
        )}
        {tab === 'family' && (
          <FamilyTab
            userName={userName}
            familyId={familyId}
            userId={userId}
            members={familyMembers}
            onChangeName={handleChangeName}
            onLeaveFamily={handleLeaveFamily}
          />
        )}
      </div>
    </div>
  );
}

// Funzione compatibile per UUID (per userId univoco)
export function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Funzione compatibile per UUID, ora per codice famiglia breve (6 caratteri)
export function generateFamilyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // senza 0,1,O,I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default App;
