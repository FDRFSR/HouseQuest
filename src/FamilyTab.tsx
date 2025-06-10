import React from 'react';

interface FamilyTabProps {
  userName: string;
  familyId: string;
  userId: string;
  members: { id: string; name: string }[];
  onChangeName: (name: string) => void;
  onLeaveFamily: () => void;
}

export const FamilyTab: React.FC<FamilyTabProps> = ({ userName, familyId, userId, members, onChangeName, onLeaveFamily }) => {
  const [editing, setEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(userName);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(familyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback per browser non compatibili
      try {
        const el = document.createElement('input');
        el.value = familyId;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        alert('Copia non supportata dal browser');
      }
    }
  };

  const handleChangeName = () => {
    if (newName.trim() && newName !== userName) {
      onChangeName(newName.trim());
      setEditing(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 18, textAlign: 'left' }}>
      <h2 style={{ fontSize: 22, margin: '0 0 12px 0', color: '#1976d2' }}>👨‍👩‍👧‍👦 Famiglia</h2>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 15, color: '#888' }}>Nome famiglia</div>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Famiglia {familyId.slice(0, 5).toUpperCase()}</div>
        <div style={{ fontSize: 15, color: '#888' }}>Codice famiglia</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 17 }}>{familyId}</span>
          <button onClick={handleCopy} style={{ fontSize: 15, padding: '2px 8px', borderRadius: 6, border: 'none', background: '#e3f2fd', color: '#1976d2', cursor: 'pointer' }}>{copied ? 'Copiato!' : 'Copia'}</button>
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 15, color: '#888' }}>Membri</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {members.length === 0 && (
            <li style={{ color: '#aaa', fontSize: 16 }}>Nessun membro nella famiglia</li>
          )}
          {members.map(m => (
            <li key={m.id} style={{ fontSize: 17, fontWeight: 500, color: '#222', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{m.id === userId ? '🧑' : '👤'}</span>
              {editing && m.id === userId ? (
                <>
                  <input value={newName} onChange={e => setNewName(e.target.value)} style={{ fontSize: 16, padding: 4, borderRadius: 5, border: '1px solid #bbb', width: 120 }} />
                  <button onClick={handleChangeName} style={{ fontSize: 15, marginLeft: 4, background: '#e8f5e9', color: '#388e3c', border: 'none', borderRadius: 5, padding: '2px 8px', cursor: 'pointer' }}>Salva</button>
                  <button onClick={() => { setEditing(false); setNewName(userName); }} style={{ fontSize: 15, marginLeft: 4, background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: 5, padding: '2px 8px', cursor: 'pointer' }}>Annulla</button>
                </>
              ) : (
                <>
                  <span>{m.name}</span>
                  {m.id === userId && (
                    <button onClick={() => setEditing(true)} style={{ fontSize: 15, marginLeft: 8, background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: 5, padding: '2px 8px', cursor: 'pointer' }}>Cambia nome</button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ textAlign: 'right' }}>
        <button onClick={onLeaveFamily} style={{ fontSize: 15, background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Esci dalla famiglia</button>
      </div>
    </div>
  );
};
