import * as config from './utils.js';
import  * as storageConfig from "./storage.js";



// 1. Événement au clic pour basculer le mode sombre
document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
    document.body.classList.toggle("dark-mode");

    // Déterminer l'état après le toggle
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : '';
    
    // Enregistrement de la préférence sur le serveur
    await config.modePreference(newTheme);
});


// 2. Chargement de la préférence au démarrage de la page
document.addEventListener('DOMContentLoaded', async () =>{
try {
     let response = await fetch (`${config.API_URL}/mode`); 
     let data = await response.json();
     let theme = data[0].mode;
        
        // CORRECTION CRITIQUE : Utiliser '===' pour la comparaison, pas '=' pour l'affectation
    if (theme === 'dark-mode') { 
     document.body.classList.add('dark-mode')
         } else{
            document.body.classList.remove('dark-mode')
        }
    } catch (error) {
        console.error("Impossible de charger la préférence de mode au démarrage:", error);
        // Si la requête échoue, on laisse le mode par défaut (clair)
    }
});



/*

document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
  document.body.classList.toggle("dark-mode");

 config.modePreference()
});


document.addEventListener('DOMContentLoaded', async () =>{
    let response = await fetch (`${config.API_URL}/mode`)
    let data = await response.json();
    let theme = data.mode;
    if (theme = 'dark-mode') {
        document.body.classList.add('dark-mode')
    } else{
        document.body.classList.remove('dark-mode')
    }

})*/

    
config.btnSearchCity.addEventListener('click', ()=>{
    config.askVille.style.display = 'flex';

    document.querySelector('.main-wrapper').style.display = 'none'

})

if (!config.noteTexte.textContent){
    config.btnAddNote.style.display = 'none';
    config.containerNote.style.display = 'flex';
};
config.setUpForm(config.askVille);



// ajouter une note
storageConfig.addNote;
config.btnAddNote.addEventListener('click', () => storageConfig.addNote(config.formAddNote))

config.annulerFormAddNote.addEventListener('click', ()=>{
    config.formAddNote.style.display = 'none';
    config.btnAddNote.style.display = 'flex';
    config.setNameVille(config.nameVille)
    storageConfig.loadNoteDuJour(config.getNameVille)
})

storageConfig.showHistorique()


// event au click sur le btn historique
config.btnHistorique.addEventListener('click', ()=> {
    document.querySelector('.historique-and-close').style.display= 'block';
    config.historiqueContainer.style.display = 'flex';
    
})
// Affichage du boutton pour fermer
config.closeBtn.addEventListener('click', ()=>{
    document.querySelector('.historique-and-close').style.display = 'none';
} )

// Pour supprimer la note c'est bon on n'y touche plus en dessous de la météo
function deleteNote(){
    let textarea  = document.querySelector('[name="note-texte"]');
    textarea.value = ""
    config.noteTexte.textContent = "";
    config.containerNote.style.display = 'none';
    config.btnAddNote.style.display = 'block';
}
document.querySelector('.btn-delete').addEventListener('click', ()=> deleteNote());

// Pour modifier la note c'est bon n'y touche plus en dessous de la météo
function modifyNote(){
    document.querySelector('.container-paragraphe-note').style.display = "none";
    config.formAddNote.style.display = 'flex';
    storageConfig.addNote(config.formAddNote);
}
document.querySelector('.btn-modifiy').addEventListener('click', ()=> modifyNote());

//Pour afficher plus d'options a coté de la note 
config.moreOptionsBtn.addEventListener('click', ()=>{
    document.querySelector('.options-box').classList.toggle('show');
    config.moreOptionsBtn.classList.toggle('turn');
});

//Supprimer l'historique
config.btnDeleteHistorique.addEventListener('click',async ()=>{

    config.historiqueContainer.innerHTML = "";
    config.historiqueContainer.textContent = "L'historique est vide"
    await fetch('/notes', {method: 'DELETE'})
    storageConfig.showBtnDeleteHistorique()
})









