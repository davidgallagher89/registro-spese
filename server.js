const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = './database.json';

// 1. IL MAGAZZINIERE CONSEGNA I DATI (GET)
app.get('/obiettivi', (req, res) => {
    if (fs.existsSync(FILE_PATH)) {
        const dati = fs.readFileSync(FILE_PATH);
        res.json(JSON.parse(dati));
    } else {
        res.json([]); // Se il file non esiste, manda una lista vuota
    }
});

// 2. IL MAGAZZINIERE RICEVE E SALVA (POST)
app.post('/obiettivi', (req, res) => {
    const nuovaTransazione = req.body; // Qui arriva { testo: "...", importo: ... }
    
    let datiSalvati = [];
    if (fs.existsSync(FILE_PATH)) {
        datiSalvati = JSON.parse(fs.readFileSync(FILE_PATH));
    }

    // Aggiungiamo la nuova spesa alla lista
    datiSalvati.push(nuovaTransazione);

    // Salviamo tutto nel file JSON
    fs.writeFileSync(FILE_PATH, JSON.stringify(datiSalvati, null, 2));

    console.log("Transazione registrata con successo!");
    res.json({ messaggio: "Dati messi al sicuro!" });
});
// 3. IL MAGAZZINIERE ELIMINA UN DATO (DELETE)
app.delete('/obiettivi/:id', (req, res) => {
    const id = parseInt(req.params.id); // Prendiamo l'indice della spesa
    
    if (fs.existsSync(FILE_PATH)) {
        let dati = JSON.parse(fs.readFileSync(FILE_PATH));
        
        // Rimuoviamo l'elemento alla posizione 'id'
        dati.splice(id, 1);
        
        // Salviamo il file aggiornato
        fs.writeFileSync(FILE_PATH, JSON.stringify(dati, null, 2));
        res.json({ messaggio: "Eliminato con successo!" });
    } else {
        res.status(404).json({ errore: "File non trovato" });
    }
});

app.listen(3000, () => console.log("Server del Bilancio attivo sulla porta 3000!"));
