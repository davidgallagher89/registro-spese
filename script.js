const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const list = document.getElementById('list');
const balance = document.getElementById('balance');
const money_plus = document.querySelector('.money.plus');
const money_minus = document.querySelector('.money.minus');

// 1. Funzione per caricare i dati dal server e aggiornare tutto
function inizializzaApp() {
    fetch('http://localhost:3000/obiettivi')
        .then(risposta => risposta.json())
        .then(dati => {
            // Puliamo la lista attuale per non duplicare
            list.innerHTML = '';
            
            // Cambia dati.forEach(aggiungiTransazioneDOM);
// Con questa, così passiamo anche la posizione (index):
dati.forEach((t, index) => aggiungiTransazioneDOM(t, index));
            // Aggiorniamo i calcoli del bilancio
            aggiornaBilancio(dati);
        })
        .catch(errore => console.error("Errore nel caricamento:", errore));
}

// 2. Funzione per creare l'elemento HTML nella lista
function aggiungiTransazioneDOM(transazione, index) { // <--- Aggiungiamo 'index'
    const classe = transazione.importo < 0 ? 'minus' : 'plus';
    const item = document.createElement('li');
    item.classList.add(classe);

    item.innerHTML = `
        ${transazione.testo} <span>${transazione.importo > 0 ? '+' : ''}${transazione.importo}€</span>
    `;

    const tastoElimina = document.createElement('button');
    tastoElimina.innerText = 'x';
    tastoElimina.classList.add('delete-btn');

    // --- LOGICA DI ELIMINAZIONE REALE ---
    tastoElimina.onclick = () => {
        fetch(`http://localhost:3000/obiettivi/${index}`, {
            method: 'DELETE'
        })
        .then(() => {
            // DOPO che il server ha cancellato, ricarichiamo tutto!
            // Questo aggiornerà anche il totale magicamente.
            inizializzaApp();
        });
    };

    item.appendChild(tastoElimina);
    list.appendChild(item);
}

 

// 3. Funzione per calcolare i totali (La matematica)
function aggiornaBilancio(transazioni) {
    const importi = transazioni.map(t => t.importo);

    const totale = importi.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const entrate = importi
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const uscite = (
        importi.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `€ ${totale}`;
    money_plus.innerText = `+€ ${entrate}`;
    money_minus.innerText = `-€ ${uscite}`;
}

// 4. Gestione dell'invio del form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Per favore inserisci descrizione e importo');
        return;
    }

    const nuovaTransazione = {
        testo: text.value,
        importo: Number(amount.value)
    };

    fetch('http://localhost:3000/obiettivi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuovaTransazione)
    })
    .then(risposta => risposta.json())
    .then(() => {
        // Appena il server conferma, ricarichiamo tutto!
        inizializzaApp();
        text.value = '';
        amount.value = '';
    });
     // Creiamo il tasto elimina

     let tastoElimina = document.createElement("button");
     tastoElimina.innerText = "Elimina";
     tastoElimina.onclick = () => nuovoLi.remove();
 
     nuovoLi.appendChild(tastoElimina);
     document.getElementById("list").appendChild(nuovoLi);
});

// Avviamo tutto al caricamento della pagina
inizializzaApp();