const express = require('express');// importer express
const app = express(); // créer une instance de l'application express
app.use(express.json()); // Pour analyser le corps des requetes json les notes par exemple
const port = process.env.PORT || 3000;// le port sur lequel le serveur écoute
const cors = require('cors');
app.use(cors())

// importer le module fs pour lire et ecrire dans le fichier notes.json
const fs = require('fs').promises

// on importe le module path intégré a Node.js
const path = require('path'); 




// Le chemin absolue vers le fichier json qui va contenir les notes
const noteFilePath = path.join(__dirname , 'notes.json')
// Le chemin absolue vers le fichier json qui va contenir le mode de préférence de l'utilisateur 
const modeFilePath = path.join(__dirname, 'mode.json');


// Servir le fichier html a la racine
app.get('/', (req, res) =>{
    let indexHtmlPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexHtmlPath);
})

// servir les fichiers statiques grace au middleware
app.use(express.static(path.join(__dirname, 'public')));

// implémentation de l'endpoint POST/notes pour réagir aux données que fetch envoie depuis le front end 
app.post('/notes', async(req, res)=>{
    // Recevoir les données de la note
    const newNote = req.body;
    
    try {
        
        const data = await fs.readFile(noteFilePath, 'utf8');// Lecture du fichier json et stockage de son contenu dans la variable data

        //convertion en tableau ou objet js
        const notes = JSON.parse(data);

        // Ajoutes la nouvelle note au tableau
        notes.push(newNote);
        await fs.writeFile(noteFilePath, JSON.stringify(notes, null, 2));

        // La réponse du serveur lorsq'il a recu la note
        res.status(201).json({message: 'Note sauvegardée avec succes',  note: ''})
    } catch (error){
        if (error.code === 'ENOENT'){
            await fs.writeFile(noteFilePath, JSON.stringify([newNote], null, 2));
            return res.status(201).json({message: 'Note sauvegardé dans un nouveau fichier', note: newNote});
        }
        console.error(error)
        res.status(500).json({message: "Erreur serveur"})
    }    
});


// implémentation de l'endpoint GET/notes pour récupérer les notes stockées sur le serveur

app.get('/notes', async(req, res)=>{
   try{
    const data = await  fs.readFile(noteFilePath, 'utf8');
    let notes = JSON.parse(data);
    res.status(200).json(notes)
   }catch(error){
    if (error.code === 'ENOENT'){
        return res.status(200).json([]); // renvoyer un fichier vide si le fichier n'existe pas encore 
    };
    console.error(error)
    res.status(500).json({message: 'Erreur serveur'});
    
   }

})


// implementation de l'endpoint DELETE/notes:id pour supprimer une note spécifique
app.delete('/notes/:id', async (req, res )=>{
    const noteId = req.params.id;
    try{
        const data = await fs.readFile(noteFilePath, 'utf8');
        let notes = JSON.parse(data);
        const notesFiltered = notes.filter(note => String(note.id) !== String(noteId));
        if (notes.length === notesFiltered.length){
            return res.status(404).json({message: "Note non trouvée"})
        }
        await fs.writeFile(noteFilePath, JSON.stringify(notesFiltered, null, 2));
        res.status(200).json({message: "Note supprimée"})

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Erreur du serveur"});
    }
})

// implementation de l'endpoint DELETE/notes POUR supprimer toutes les notes de l'historique
app.delete('/notes', async(req, res) =>{
    try{
    await fs.writeFile(noteFilePath, JSON.stringify([], null, 2));
    res.status(200).json({message: "Historique supprimé"})
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Erreur serveur'});
    }
})


app.get('/notes/:id', async(req, res)=>{
   const  noteId = req.params.id;
   try{
    const data = await fs.readFile(noteFilePath, 'utf8')
    const notes = JSON.parse(data);
    const note = notes.find(n => String(n.id) === String(noteId));
    if (!note){
        return res.status(404).json({message: "Note non trouvée"});
    }
    res.status(200).json(note)
   }catch(error){
    console.error(error);
    res.status(500).json({message: "Erreur du serveur"})
   }

})


// Pour gérer les préferences en mode sombre ou clair
app.put('/mode', async(req, res)=>{
    const preferences = req.body;
    try{
        // Lecture du fichier mode et stockage de son contenu dans une variable
        //let data = await fs.readFile(modeFilePath, 'utf8');
        //data.push(preferences);
        //Ecraser le contenu du fichier mode.json et ajouter un nouveau contenu
        await fs.writeFile(modeFilePath, JSON.stringify(preferences, null, 2));
        res.status(201).json({message: "Le mode a bien été enregistrée"})


    } catch(error){
        console.error(error);
        res.status(500).json({message: "Erreur serveur"});

    }

})

app.get('/mode', async (req, res)=>{
    try{
        const data = await fs.readFile(modeFilePath, 'utf8');
        const mode = JSON.parse(data);
        res.status(200).json({message: "Note récupérée avec succes "})
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})

    }

})

// Pour que l'app express soit active et réponde a tt les requetes 
app.listen(3000, ()=>{
    console.log('Le serveur est lancé sur le port 3000')
});

