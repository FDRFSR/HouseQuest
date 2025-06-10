import { useState, useEffect } from 'react';
import { uuidv4 } from './App';

export interface Task {
  id: string;
  text: string;
  room: string;
  done: boolean;
  points: number;
  emoji?: string; // aggiunto emoji opzionale
}

const ROOMS = [
  { name: 'Camera', emoji: '🛏️' },
  { name: 'Cucina', emoji: '🍽️' },
  { name: 'Bagno', emoji: '🛁' },
  { name: 'Soggiorno', emoji: '🛋️' },
  { name: 'Balcone', emoji: '🌞' },
  { name: 'Garage', emoji: '🚗' },
  { name: 'Studio', emoji: '💻' },
  { name: 'Giardino', emoji: '🌳' },
  { name: 'Lavanderia', emoji: '🧺' },
  { name: 'Corridoio', emoji: '🚪' },
];

const TASK_OPTIONS = [
  // Camera
  { text: 'Rifare il letto', room: 'Camera', emoji: '🛏️', points: 5 },
  { text: 'Passare l’aspirapolvere', room: 'Camera', emoji: '🧹', points: 3 },
  { text: 'Riordinare armadio', room: 'Camera', emoji: '👚', points: 2 },
  { text: 'Pulire comodini', room: 'Camera', emoji: '🧽', points: 1 },
  { text: 'Aprire le finestre', room: 'Camera', emoji: '🪟', points: 1 },
  // Cucina
  { text: 'Lavare i piatti', room: 'Cucina', emoji: '🍽️', points: 3 },
  { text: 'Buttare la spazzatura', room: 'Cucina', emoji: '🗑️', points: 2 },
  { text: 'Pulire il tavolo', room: 'Cucina', emoji: '🧼', points: 1 },
  { text: 'Riordinare dispensa', room: 'Cucina', emoji: '🥫', points: 2 },
  { text: 'Pulire il frigorifero', room: 'Cucina', emoji: '🧊', points: 3 },
  { text: 'Caricare lavastoviglie', room: 'Cucina', emoji: '🍴', points: 2 },
  // Bagno
  { text: 'Pulire il bagno', room: 'Bagno', emoji: '🧼', points: 4 },
  { text: 'Cambiare asciugamani', room: 'Bagno', emoji: '🧻', points: 1 },
  { text: 'Pulire specchio', room: 'Bagno', emoji: '🪞', points: 1 },
  { text: 'Riordinare prodotti', room: 'Bagno', emoji: '🧴', points: 1 },
  // Soggiorno
  { text: 'Riordinare giochi', room: 'Soggiorno', emoji: '🧸', points: 2 },
  { text: 'Spolverare', room: 'Soggiorno', emoji: '🧽', points: 2 },
  { text: 'Passare il mocio', room: 'Soggiorno', emoji: '🧹', points: 3 },
  { text: 'Sistemare cuscini', room: 'Soggiorno', emoji: '🛋️', points: 1 },
  // Balcone
  { text: 'Annaffiare piante', room: 'Balcone', emoji: '🪴', points: 2 },
  { text: 'Pulire pavimento', room: 'Balcone', emoji: '🧽', points: 2 },
  { text: 'Svuotare cenere', room: 'Balcone', emoji: '🚬', points: 1 },
  // Garage
  { text: 'Riordinare attrezzi', room: 'Garage', emoji: '🔧', points: 3 },
  { text: 'Spazzare garage', room: 'Garage', emoji: '🧹', points: 2 },
  { text: 'Controllare biciclette', room: 'Garage', emoji: '🚲', points: 1 },
  // Studio
  { text: 'Riordinare scrivania', room: 'Studio', emoji: '🖥️', points: 2 },
  { text: 'Pulire monitor', room: 'Studio', emoji: '🧽', points: 1 },
  { text: 'Organizzare documenti', room: 'Studio', emoji: '📄', points: 2 },
  // Giardino
  { text: 'Tagliare erba', room: 'Giardino', emoji: '🌱', points: 4 },
  { text: 'Raccogliere foglie', room: 'Giardino', emoji: '🍂', points: 2 },
  { text: 'Sistemare giochi', room: 'Giardino', emoji: '⚽', points: 1 },
  // Lavanderia
  { text: 'Stendere i panni', room: 'Lavanderia', emoji: '👕', points: 2 },
  { text: 'Ritirare i panni', room: 'Lavanderia', emoji: '🧺', points: 2 },
  { text: 'Piegare i vestiti', room: 'Lavanderia', emoji: '🧦', points: 2 },
  // Corridoio
  { text: 'Spazzare corridoio', room: 'Corridoio', emoji: '🧹', points: 1 },
  { text: 'Pulire tappeti', room: 'Corridoio', emoji: '🧼', points: 1 },
];

// Props per MainScreen: tasks e setTasks
export function MainScreen({ tasks, setTasks }: { tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerRoom, setPickerRoom] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ points: number; text: string } | null>(null);

  // Rimuovi task completate a fine giornata
  useEffect(() => {
    const now = new Date();
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();
    const timeout = setTimeout(() => {
      setTasks(tasks => tasks.filter(t => !t.done));
    }, msToMidnight);
    return () => clearTimeout(timeout);
  }, [tasks]);

  function addTask(option: { text: string; room: string; points: number }) {
    setTasks([
      ...tasks,
      { id: uuidv4(), text: option.text, room: option.room, done: false, points: option.points },
    ]);
  }

  function toggleTask(id: string) {
    setTasks(tasks => tasks.map(t => {
      if (t.id === id && !t.done) {
        setPopup({ points: t.points, text: t.text });
        setTimeout(() => setPopup(null), 500); // popup ancora più veloce
      }
      return t.id === id ? { ...t, done: !t.done } : t;
    }));
  }

  function deleteTask(id: string) {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left', padding: 8 }}>
      {popup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.10)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          animation: 'fadeInBg 0.2s',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #eaffea 70%, #d0ffd0 100%)',
            borderRadius: 14,
            padding: '16px 14px',
            boxShadow: '0 2px 12px #4caf5022',
            textAlign: 'center',
            fontSize: 16,
            color: '#222',
            fontWeight: 700,
            minWidth: 120,
            maxWidth: 180,
            border: '2px solid #4caf50',
            animation: 'popup-bounce 0.4s',
            position: 'relative',
          }}>
            <div style={{ fontSize: 24, color: '#388e3c', marginBottom: 4, textShadow: '0 1px 4px #4caf5022' }}>+{popup.points} pt</div>
            <div style={{ fontSize: 13, color: '#444', marginBottom: 0, fontWeight: 500 }}>{popup.text}</div>
          </div>
          <style>{`
            @keyframes popup-bounce {
              0% { transform: scale(0.7); opacity: 0; }
              60% { transform: scale(1.08); opacity: 1; }
              80% { transform: scale(0.97); }
              100% { transform: scale(1); }
            }
            @keyframes fadeInBg {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
      <button
        onClick={() => { setShowPicker(true); setPickerRoom(null); }}
        style={{ width: '100%', padding: '14px 0', fontSize: 18, borderRadius: 8, background: '#646cff', color: '#fff', border: 'none', marginBottom: 24 }}
      >
        Scegli task
      </button>
      {showPicker && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 280, maxWidth: 340, boxShadow: '0 2px 16px #0002' }}>
            {!pickerRoom ? (
              <>
                <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Scegli una stanza</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {ROOMS.map(room => (
                    <button
                      key={room.name}
                      onClick={() => setPickerRoom(room.name)}
                      style={{ flex: '1 1 120px', padding: '14px 0', fontSize: 18, borderRadius: 10, background: '#f6f8ff', color: '#333', border: '2px solid #646cff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 100, cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: 28 }}>{room.emoji}</span>
                      {room.name}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowPicker(false)} style={{ marginTop: 16, width: '100%', padding: 10, borderRadius: 8, border: 'none', background: '#eee', fontSize: 16 }}>Annulla</button>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{ROOMS.find(r => r.name === pickerRoom)?.emoji}</span> Scegli un task per {pickerRoom}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TASK_OPTIONS.filter(t => t.room === pickerRoom).map(opt => (
                    <button
                      key={opt.text}
                      onClick={() => addTask(opt)}
                      disabled={tasks.some(t => t.text === opt.text && t.room === opt.room && !t.done)}
                      style={{
                        padding: '10px 14px',
                        fontSize: 16,
                        borderRadius: 8,
                        border: '1px solid #646cff',
                        background: tasks.some(t => t.text === opt.text && t.room === opt.room && !t.done) ? '#e0e0e0' : '#f6f8ff',
                        color: tasks.some(t => t.text === opt.text && t.room === opt.room && !t.done) ? '#aaa' : '#333',
                        cursor: tasks.some(t => t.text === opt.text && t.room === opt.room && !t.done) ? 'not-allowed' : 'pointer',
                        flex: '1 1 120px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontWeight: 600,
                        opacity: tasks.some(t => t.text === opt.text && t.room === opt.room && !t.done) ? 0.5 : 1,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{opt.emoji}</span> <span style={{ whiteSpace: 'normal', textAlign: 'left' }}>{opt.text}</span>
                      {tasks.some(t => t.text === opt.text && t.room === opt.room && !t.done) && (
                        <span style={{ marginLeft: 6, fontSize: 15, color: '#888' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPickerRoom(null)} style={{ marginTop: 16, width: '100%', padding: 10, borderRadius: 8, border: 'none', background: '#eee', fontSize: 16 }}>Indietro</button>
              </>
            )}
          </div>
        </div>
      )}
      {ROOMS.filter(room => tasks.some(t => t.room === room.name)).map(room => (
        <div key={room.name} style={{ marginBottom: 20 }}>
          <h4 style={{ margin: '8px 0 4px 0', color: '#646cff', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>{room.emoji}</span> {room.name}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.filter(t => t.room === room.name).map(task => (
              <li
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 10,
                  fontSize: 18,
                  background: task.done ? '#e0ffe0' : '#fff',
                  borderRadius: 8,
                  cursor: 'pointer',
                  opacity: task.done ? 0.6 : 1,
                  transition: 'background 0.2s, opacity 0.2s',
                  padding: '8px 4px',
                  userSelect: 'none',
                  fontWeight: 600,
                  color: '#222',
                  boxShadow: '0 1px 4px #0001',
                  border: '1px solid #e0e0e0',
                }}
                aria-label={task.done ? 'Task completata' : 'Completa task'}
              >
                <span style={{ textDecoration: task.done ? 'line-through' : 'none', flex: 1, display: 'flex', alignItems: 'center', gap: 6, color: '#222' }}>
                  <span style={{ fontSize: 18 }}>{TASK_OPTIONS.find(o => o.text === task.text)?.emoji}</span> <span style={{ whiteSpace: 'normal' }}>{task.text}</span>
                </span>
                <button
                  onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                  style={{
                    background: 'rgba(244,67,54,0.12)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                    boxShadow: '0 1px 4px #f4433622',
                    padding: 0,
                  }}
                  aria-label="Elimina task"
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
                  onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
                  onFocus={e => e.currentTarget.style.background = 'rgba(244,67,54,0.22)'}
                  onBlur={e => e.currentTarget.style.background = 'rgba(244,67,54,0.12)'}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(244,67,54,0.22)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(244,67,54,0.12)'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
