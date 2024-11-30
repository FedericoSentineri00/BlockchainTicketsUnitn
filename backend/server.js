const express = require('express');
const cors = require('cors'); // Per permettere richieste CORS dal frontend Angular
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200', credentials: true })); // Permetti richieste CORS
app.use(bodyParser.json());
app.use(cookieParser());

const validCredentials = {
  username: '2',
  password: '2',
};

const secretKey = 'kronos'; // Usa una chiave segreta lunga e sicura

// Endpoint di login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica credenziali
  if (username === validCredentials.username && password === validCredentials.password) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' }); // Token valido 1 minuto
    res.cookie('authToken', token, {
      httpOnly: true, 
      secure: false,  
      sameSite: 'strict', 
      maxAge: 60 * 1000,  
    });
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware per autenticare il token
function authenticateToken(req, res, next) {
  const token = req.cookies.authToken; // Leggi il token dal cookie

  if (!token) return res.status(401).send('Token mancante');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).send('Token non valido o scaduto');
    req.user = decoded; // Aggiungi le informazioni decodificate alla richiesta
    next();
  });
}

// Endpoint protetto
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Benvenuto ${req.user.username}` });
});

// Logout: cancella il cookie
app.post('/logout', (req, res) => {
  res.clearCookie('authToken'); // Cancella il cookie
  res.status(200).json({ message: 'Logout successful' });
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});