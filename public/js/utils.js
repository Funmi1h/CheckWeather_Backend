// Déclaration des variables 

import apiConfig from './api.js'

export let loader = document.querySelector('.loader');
export let askVille = document.querySelector('.ask-ville');
export let mainWrapper = document.querySelector('.main-wrapper');
export let btnAskVille = document.getElementById('ask-ville-submit');
export let ville = document.querySelector('.ville');
export let icone = document.querySelector('.icone');
export let temperature = document.querySelector('.temperature');
export let minTemperature = document.querySelector('.min-temperature');
export let maxTemperature = document.querySelector('.max-temperature')
export let description = document.querySelector('.description');
export let prenomVille = document.querySelector('.ask-ville');
export let divAddNote = document.querySelector('.add-note')
export let btnAddNote = document.getElementById('btn-add-note');
export let formAddNote = document.querySelector('.add-note-form');
export let noteTexte  = document.querySelector('.paragraphe-note-texte');
export let containerNote = document.querySelector('.container-paragraphe-note')
export let btnDeleteHistorique = document.querySelector('.btn-delete-historique');
export let annulerFormAddNote = document.querySelector('.annuler-form')
export let btnRetry = document.querySelector('.retry');
export let errorLoader = document.querySelector('.loader-error');
export let btnSearchCity = document.querySelector('.search-ville');
export let historiqueContainer = document.querySelector('.historique-container');
export let btnHistorique = document.getElementById('btn-historique');
export let closeBtn = document.querySelector('.close-btn');
export let moreOptionsBtn =document.querySelector('.dropdown');
export function capitalizeFirstLetter(text){
   return text[0].toUpperCase() + text.slice(1)    
};

export // Affichage du loader  et du mainWrapper
    /* Fonctionne bien pas touche */
function loading(){
    askVille.style.display = 'none';
    loader.style.display = 'flex';
    setTimeout(() =>{
        mainWrapper.style.display = 'block';
        loader.style.display = 'none'

    }, 3000);

};
// Loading en cas d'erreur; Cette fonction fonctionne n'y touche pas
export function loadingError(){
    errorLoader.style.display = 'flex';
    btnRetry.addEventListener('click', ()=>{
        location.reload();
        askVille.style.display = 'none';
    }
    )
};

export let nameVille;

export function getDate(){
    let now = new Date(); // Création d'un objet Date contenant la date et l'heure du moment présent en fonction de l'horloge du pc ou ...
    let day = String(now.getDate()).padStart(2, "0");
    let month =String(now.getMonth() +1).padStart(2, "0");
    let year = now.getFullYear();
    let hour = now.getHours();
    let minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hour}: ${minutes}`;

}

export // Xa fonctionne
function setUpForm(form){
    form.addEventListener('submit', (event) =>{
        event.preventDefault();  
        apiConfig.getWeather(form);
        form.style.display = 'none';
    });
};




export function setNameVille(nom){
    nameVille = nom;
}

export function getNameVille(){
    return nameVille;
}

export const API_URL  = 'https://checkweather-backend.onrender.com'
/*export async  function modePreference(){
     if(body.classList.contains('dark-mode')){
    let preferences = {mode: 'dark-mode'}
    try{
        await fetch ('/preferences/mode', {
        method: "PUT",
        headers: {
          'Content-Type': "application/json" 
        },
        body: JSON.stringify(preferences)
    })
    if (!response.ok){
        console.log(`Erreur lors de la sauvegarde de la note${response.status}`)
    }
    console.log("Mode sauvegardée avec succes")

    }catch(error){
        console.error(`Erreur de connexion au serveur`)
    }
    

  }else{
     let preferences = {mode: ''}
    try{
        await fetch (`${config.API_URL}/mode`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json" 
        },
        body: JSON.stringify(preferences)
    })
    if (!response.ok){
        console.log(`Erreur lors de la sauvegarde de la note${response.status}`)
    }
    console.log("Mode sauvegardée avec succes")

    }catch(error){
        console.error(`Erreur de connexion au serveur`)
    }
  }
}*/


export async function modePreference(themeValue){
    let preferences = { mode: themeValue }
    try{
    const response = await fetch (`${API_URL}/mode`, { 
    method: "PUT",
    headers: {
        'Content-Type': "application/json" 
         },
         body: JSON.stringify(preferences)
         });

         if (!response.ok){
         console.error(`Erreur lors de la sauvegarde du mode: ${response.status}`)
             throw new Error("Erreur de sauvegarde côté serveur.");
    }
     console.log("Mode sauvegardé avec succès sur le serveur:", themeValue)

    }catch(error){
    console.error(`Erreur de connexion au serveur ou de traitement de la requête:`, error)
}
}
