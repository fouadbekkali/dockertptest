const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Servir les fichiers statiques (index.html, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Proxy pour les appels API vers le backend
// app.use('/api', createProxyMiddleware({
//   target: `http://${process.env.BACKEND_HOST || 'localhost'}:${process.env.BACKEND_PORT || 8002}`,
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api': '/api'
//   }
// Proxy pour les appels API vers le backend
app.use('/api', createProxyMiddleware({
  target: `http://localhost:8002`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onError: (err, req, res) => {
    console.error('Erreur du proxy:', err);
    res.status(503).json({
      success: false,
      message: 'Impossible de se connecter au backend',
      error: err.message
    });
  }
}));

// Route pour la racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend démarré sur le port ${PORT}`);
  console.log(`📍 Accédez à http://localhost:${PORT}`);
  console.log(`🔗 Backend: http://${process.env.BACKEND_HOST || 'localhost'}:${process.env.BACKEND_PORT || 8002}`);
});
