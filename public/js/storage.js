import * as config from './utils.js'


//montrer le boutton deletehistorique
function showBtnDeleteHistorique() {
    const container = config.historiqueContainer;
    const btnDelete = config.btnDeleteHistorique;

    if (!container || !btnDelete) return; // sécurité si un élément est introuvable

    const contenuTexte = container.textContent.trim();
    const contenuHTML = container.innerHTML.trim();

    const estVide = contenuTexte === "L'historique est vide" || contenuHTML === "";

    if (estVide) {
        container.textContent = "L'historique est vide";
        btnDelete.style.display = "none";
    } else {
        btnDelete.style.display = "block";
    }
}


// fonction pour ajouter une note 
export async function addNote(form){
    config.containerNote.style.display = 'none'
    config.btnAddNote.style.display = 'none';
    form.style.display = 'flex';
    document.getElementById('note-texte').textContent = " "

    form.addEventListener('submit', async (event)=>{
        event.preventDefault();

        // Supprimer l'ancien message d'erreur si xa existe
        let existingError = form.querySelector('.note-error');
        if (existingError) existingError.remove();
        let formData = new FormData(form);
        // Comme formData n'est pas idéal pour envoyer du json on va récupérer directement la valeur du textarea
        let noteValue = document.getElementById('note-texte').value.trim()
        if (noteValue === ""){
            let spanEmptyNote = document.createElement('span');
            spanEmptyNote.classList.add('note-error');
            spanEmptyNote.textContent = "Veuillez écrire une note avant de l'enregistrer.";
            spanEmptyNote.style.color = 'white';
            config.formAddNote.appendChild(spanEmptyNote);
            return;            
        } 
        form.style.display = 'none';
        config.noteTexte.textContent = formData.get('note-texte');
        config.containerNote.style.display = 'flex';
        document.querySelector('.note-date').textContent = config.getDate();


        // Créer l'objet json a envoyer au serveur
         let noteData = {
            id : Date.now(), // un identifiant unique est 
            ville: config.ville.textContent,
            temperature : config.temperature.textContent,
            icone: config.icone.src,
            description : config.description.textContent,
            note: noteValue,
            date: config.getDate() ,
        };

        // Envoie de l'objet contenant la note au serveur
        try{
            const response = await fetch(`${config.API_URL}/notes`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)// On convertit l'objet a envoyé au serveur en format json

            });

            // On veut analyser la réponse duserveur
            const data = await response.json();

            if (response.ok){
                console.log('Note sauvegardéee avec succes:', data);
                // Fonction pour recharger l'historique
            }else{
                console.error('Erreur lors de la sauvegarde cote serveur:',data)
                // Afficher a l'écran que la note n'a pa pu etre sauvegardée
            }

        }catch{
            console.error('Erreur de connexion (Serveur non démarré)')
            // Afficher un message de verifier votre connexion
        }
        showHistorique()
        showBtnDeleteHistorique()
        let dateSansHeure = config.getDate().split("à")[0]; 

       
    });

}


// La fonction qui est appelée lorsqu'on clique sur le butoon Historique des notes
// Cette fonction envoie une requete GET  vers le serveur et permet d'afficher les notes stockées

async function loadNoteFromBackend() {
    try{
        const response = await fetch(`${config.API_URL}/notes`);
        if(!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`);
        };
        const notes = await response.json();
        return notes ;
        // Fonction pour afficher les notes dans l'historique 
    } catch(error){
        console.error ('Impossible de récupérer l\'historique des notes');
        config.historiqueContainer.innerHTML = '<p style= "color: red;">Erreur lors du chargement de l\'historique</p>'

    }

    
}



// Pour supprimer chaque note

export async function deleteNoteFromHistorique(id){
    try{
        await fetch(`${config.API_URL}/notes/${id}`, {method: 'DELETE'});
    }catch(e){
        alert('erreur lors de la suppresion de la note')
    }
    showHistorique()
}

async function showHistorique(){
    let historiqueNote = await loadNoteFromBackend();
     
    config.historiqueContainer.innerHTML ="";
    if (!historiqueNote) historiqueNote = [];
    if(historiqueNote.length === 0) config.historiqueContainer.innerHTML = "L'historique est vide ";
    historiqueNote.forEach(entry =>{
        let card = document.createElement('div');
        card.classList.add('historique-carte');
        card.innerHTML = `
        <div class= "général">
            <h3> ${entry.ville}</h3>
            <p class="date">${entry.date}</p>
        </div>

        
        `;
        
        

        // Bouton pour supprimer la carte
        let btnDeleteCard = document.createElement('ion-icon');
        btnDeleteCard.setAttribute("name", "trash-outline");
        btnDeleteCard.classList.add('btn-delete-card')
        card.appendChild(btnDeleteCard);
        btnDeleteCard.addEventListener('click', async ()=>{
        await deleteNoteFromHistorique(entry.id);
        })
        
        

        //Afficher les détails au click
        let detailsVisible = false;
        let detailsDiv = null
        card.addEventListener('click', async function(e) {
            if (e.target === btnDeleteCard) return;
            if (!detailsVisible) {
                // Récupère les détails depuis le serveur
                const response = await fetch(`${config.API_URL}/notes/${entry.id}`);
                if (response.ok) {
                    const note = await response.json();
                    detailsDiv = document.createElement('div');
                    detailsDiv.innerHTML = `
                        <img src="${note.icone}" alt="meteo">
                        <p>${note.temperature} - ${note.description}</p>
                        <p class="note">Note: ${note.note}</p>
                    `;
                    card.appendChild(detailsDiv);
                    detailsVisible = true;
                }
            } else {
                if (detailsDiv) {
                    card.removeChild(detailsDiv);
                    detailsVisible = false;
                }
            }
        });

        
        
        config.historiqueContainer.appendChild(card);


    });
showBtnDeleteHistorique();

 

}

export async function loadNoteDuJour(villeRecherchee){
   let historiqueNotes = await loadNoteFromBackend();
    let dateSansHeure = config.getDate().split("à")[0];
    let noteDuJour = historiqueNotes.find(entry =>{
    let entryDataSansHeure = entry.date.split("à")[0];
    return entry.ville === villeRecherchee && entryDataSansHeure ===dateSansHeure;
});
 if (noteDuJour) {
    let noteArea = document.getElementById('note-texte')
    noteArea.value = noteDuJour.note;
    config.noteTexte.textContent = noteDuJour.note;
    config.containerNote.style.display = 'flex';
    config.formAddNote.style.display = 'none';
    config.btnAddNote.style.display = 'none';
    document.querySelector('.note-date').textContent = noteDuJour.date;
    } else {
    // On a pas trouver d'entrée 
    config.noteTexte.textContent = "";
    config.containerNote.style.display = 'none';
    config.btnAddNote.style.display = 'block';
    showHistorique()
    }
};




export {loadNoteFromBackend};
export {showHistorique}
export {showBtnDeleteHistorique}
