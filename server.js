const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS avancée
const corsOptions = {
    origin: ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'webapp')));

// Log des requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Route pour valider que le serveur est actif
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Route pour les produits
app.get('/api/products', async (req, res) => {
    console.log('Demande API reçue pour /api/products');
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        console.log(`Données reçues de Fake Store API: ${response.data.length} produits`);
        
        // Pour déboguer, loggons le premier produit
        if (response.data.length > 0) {
            console.log('Premier produit:', JSON.stringify(response.data[0]).substring(0, 200) + '...');
        }
        
        // Vérifier que la réponse est bien un tableau
        if (!Array.isArray(response.data)) {
            console.warn('La réponse de l\'API n\'est pas un tableau:', typeof response.data);
        }
        
        // Ajouter des en-têtes CORS explicitement
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.status, error.response.statusText);
        }
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Route pour les paniers
app.get('/api/carts', async (req, res) => {
    console.log('Demande API reçue pour /api/carts');
    try {
        const response = await axios.get('https://fakestoreapi.com/carts');
        console.log(`Données reçues de Fake Store API: ${response.data.length} paniers`);
        
        // Ajouter des en-têtes CORS explicitement
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching carts:', error.message);
        res.status(500).json({ error: 'Failed to fetch carts' });
    }
});

// Route pour servir l'application UI5
app.get('/', (req, res) => {
    console.log('Demande reçue pour la page d\'accueil');
    res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
});

// Support pour les requêtes CORS preflight
app.options('*', cors(corsOptions));

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Essayer différents ports si le port principal est occupé
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`API disponible à http://localhost:${port}/api/products`);
        console.log(`Application disponible à http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying port ${port + 1}`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(PORT); 