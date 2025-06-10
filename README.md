# HouseQuest

Questa è una web app per la gestione di task familiari quotidiani, sviluppata con React, TypeScript e Vite. Utilizza Firebase per autenticazione e database.

## Funzionalità
- Login semplice (solo nome)
- Creazione o unione a una famiglia tramite codice
- 3 tab: Principale, Risultati raggiunti, Famiglia
- Salvataggio dati su Firebase Firestore (da implementare)
- Deploy su Firebase Hosting

## Sviluppo locale
```bash
npm install
npm run dev
```

## Deploy su Firebase Hosting
1. Installa Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   # Scegli Hosting, collega il progetto, imposta la cartella build/dist
   npm run build
   firebase deploy
   ```

## Struttura progetto
- `/src` — codice sorgente React
- `/public` — file statici

---

Per domande o suggerimenti, apri una issue.
