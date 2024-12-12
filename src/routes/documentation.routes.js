// src/routes/documentation.routes.js
const express = require('express');
const router = express.Router();
const { marked } = require('marked');
const fs = require('fs').promises;
const path = require('path');

// Cette fonction charge et convertit le fichier de documentation
async function loadDocumentation() {
    try {
        // Nous utilisons path.join pour créer un chemin compatible avec tous les systèmes d'exploitation
        const docPath = path.join(__dirname, '..', 'docs', 'api-documentation.md');
        console.log('Chemin du fichier:', docPath);

        const markdown = await fs.readFile(docPath, 'utf-8');
        // Conversion du Markdown en HTML pour l'affichage
        return marked(markdown);
    } catch (error) {
        console.error('Erreur lors du chargement de la documentation:', error);
        // En cas d'erreur, nous retournons un message formaté en HTML
        return '<div class="alert alert-danger">Une erreur est survenue lors du chargement de la documentation.</div>';
    }
}

// Route pour afficher la page de documentation
router.get('/', async (req, res) => {
    try {
        const documentationHtml = await loadDocumentation();
        res.render('pages/documentation', { 
            docs: documentationHtml,
            error: null
         });
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la documentation:', error);
        res.render('pages/documentation', { 
            docs: null,
            error: 'Erreur lors du chargement de la documentation: ' + error.message
        });
    }
});

module.exports = router;