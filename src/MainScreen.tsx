import { useState, useEffect } from 'react';

interface Task {
  id: string;
  text: string;
  room: string;
  done: boolean;
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
  { text: 'Rifare il letto', room: 'Camera', emoji: '🛏️' },
  { text: 'Passare l’aspirapolvere', room: 'Camera', emoji: '🧹' },
  { text: 'Riordinare armadio', room: 'Camera', emoji: '👚' },
  { text: 'Pulire comodini', room: 'Camera', emoji: '🧽' },
  { text: 'Aprire le finestre', room: 'Camera', emoji: '🪟' },
  // Cucina
  { text: 'Lavare i piatti', room: 'Cucina', emoji: '🍽️' },
  { text: 'Buttare la spazzatura', room: 'Cucina', emoji: '🗑️' },
  { text: 'Pulire il tavolo', room: 'Cucina', emoji: '🧼' },
  { text: 'Riordinare dispensa', room: 'Cucina', emoji: '🥫' },
  { text: 'Pulire il frigorifero', room: 'Cucina', emoji: '🧊' },
  { text: 'Caricare lavastoviglie', room: 'Cucina', emoji: '🍴' },
  // Bagno
  { text: 'Pulire il bagno', room: 'Bagno', emoji: '🧼' },
  { text: 'Cambiare asciugamani', room: 'Bagno', emoji: '🧻' },
  { text: 'Pulire specchio', room: 'Bagno', emoji: '🪞' },
  { text: 'Riordinare prodotti', room: 'Bagno', emoji: '🧴' },
  // Soggiorno
  { text: 'Riordinare giochi', room: 'Soggiorno', emoji: '🧸' },
  { text: 'Spolverare', room: 'Soggiorno', emoji: '🧽' },
  { text: 'Passare il mocio', room: 'Soggiorno', emoji: '🧹' },
  { text: 'Sistemare cuscini', room: 'Soggiorno', emoji: '🛋️' },
  // Balcone
  { text: 'Annaffiare piante', room: 'Balcone', emoji: '🪴' },
  { text: 'Pulire pavimento', room: 'Balcone', emoji: '🧽' },
  { text: 'Svuotare cenere', room: 'Balcone', emoji: '🚬' },
  // Garage
  { text: 'Riordinare attrezzi', room: 'Garage', emoji: '🔧' },
  { text: 'Spazzare garage', room: 'Garage', emoji: '🧹' },
  { text: 'Controllare biciclette', room: 'Garage', emoji: '🚲' },
  // Studio
  { text: 'Riordinare scrivania', room: 'Studio', emoji: '🖥️' },
  { text: 'Pulire monitor', room: 'Studio', emoji: '🧽' },
  { text: 'Organizzare documenti', room: 'Studio', emoji: '📄' },
  // Giardino
  { text: 'Tagliare erba', room: 'Giardino', emoji: '🌱' },
  { text: 'Raccogliere foglie', room: 'Giardino', emoji: '🍂' },
  { text: 'Sistemare giochi', room: 'Giardino', emoji: '⚽' },
  // Lavanderia
  { text: 'Stendere i panni', room: 'Lavanderia', emoji: '👕' },
  { text: 'Ritirare i panni', room: 'Lavanderia', emoji: '🧺' },
  { text: 'Piegare i vestiti', room: 'Lavanderia', emoji: '🧦' },
  // Corridoio
  { text: 'Spazzare corridoio', room: 'Corridoio', emoji: '🧹' },
  { text: 'Pulire tappeti', room: 'Corridoio', emoji: '🧼' },
];

interface MainScreenProps {
  userName: string;
}

export function MainScreen({ userName }: MainScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerRoom, setPickerRoom] = useState<string | null>(null);

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

  function addTask(option: { text: string; room: string }) {
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), text: option.text, room: option.room, done: false },
    ]);
    setPickerRoom(null);
    setShowPicker(false);
  }

  function toggleTask(id: string) {
    setTasks(tasks => tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id: string) {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left', padding: 8 }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>Ciao, {userName}!</h2>
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
                      style={{ padding: '10px 14px', fontSize: 16, borderRadius: 8, border: '1px solid #646cff', background: '#f6f8ff', color: '#333', cursor: 'pointer', flex: '1 1 120px', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
                    >
                      <span style={{ fontSize: 18 }}>{opt.emoji}</span> <span style={{ whiteSpace: 'normal', textAlign: 'left' }}>{opt.text}</span>
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
                  style={{ color: '#fff', background: '#c00', border: 'none', borderRadius: 8, fontSize: 20, width: 36, height: 36, cursor: 'pointer', touchAction: 'manipulation' }}
                  aria-label="Elimina task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
