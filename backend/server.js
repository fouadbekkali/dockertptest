const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 8002;

// Connexion à la base de données MySQL
// const db = mysql.createPool({
//   host: process.env.DB_HOST || 'mysql',
//   user: process.env.DB_USER || 'todo',
//   password: process.env.DB_PASSWORD || 'todopass',
//   database: process.env.DB_NAME || 'tododb',
//   port: process.env.DB_PORT || 3306
// });
// Connexion à la base de données MySQL (Mise à jour pour XAMPP/Localhost)
const db = mysql.createPool({
  host: 'localhost',      // Bdlna 'mysql' b 'localhost'
  user: 'root',           // F XAMPP l'user par défaut howa 'root'
  password: '',           // F XAMPP l'password par défaut kaykoun khawi
  database: 'tododb',     // Smiyat la base de données
  port: 3308
});
// Middleware
app.use(cors()); // by hamid mohim dakxi dyaal l7imaya okdaa 
app.use(express.json());

// Routes

// GET - Récupérer tous les items
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur DB', error: err });
    }
    res.json({ success: true, data: results, message: 'Items récupérés avec succès' });
  });
});

// GET - Récupérer un item par ID
app.get('/api/items/:id', (req, res) => {
  db.query('SELECT * FROM items WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur DB', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Item non trouvé' });
    }
    res.json({ success: true, data: results[0] });
  });
});

// POST - Créer un nouvel item
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Le nom est requis' });
  }
  db.query('INSERT INTO items (name, completed) VALUES (?, ?)', [name, false], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur DB', error: err });
    }
    db.query('SELECT * FROM items WHERE id = ?', [result.insertId], (err2, results) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'Erreur DB', error: err2 });
      }
      res.status(201).json({ success: true, data: results[0], message: 'Item créé avec succès' });
    });
  });
});

// PUT - Mettre à jour un item
app.put('/api/items/:id', (req, res) => {
  const { name, completed } = req.body;
  db.query('UPDATE items SET name = COALESCE(?, name), completed = COALESCE(?, completed) WHERE id = ?', [name, completed, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur DB', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item non trouvé' });
    }
    db.query('SELECT * FROM items WHERE id = ?', [req.params.id], (err2, results) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'Erreur DB', error: err2 });
      }
      res.json({ success: true, data: results[0], message: 'Item mis à jour avec succès' });
    });
  });
});

// DELETE - Supprimer un item
app.delete('/api/items/:id', (req, res) => {
  db.query('DELETE FROM items WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur DB', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item non trouvé' });
    }
    res.json({ success: true, message: 'Item supprimé avec succès' });
  });
});

// Route de santé pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API est en bon état de fonctionnement'
  });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur API démarré sur le port ${PORT}`);
  console.log(`📍 Accédez à http://localhost:${PORT}/api/health`);
});
// 
