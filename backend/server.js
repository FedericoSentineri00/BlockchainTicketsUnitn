const express = require('express');
const cors = require('cors'); // Per permettere richieste CORS dal frontend Angular
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200', credentials: true })); 
app.use(bodyParser.json());
app.use(cookieParser());

const mongoURI = 'mongodb+srv://eddieveronese1928:UBI9zIBoARBAMSOm@ticketbc.yd19y.mongodb.net/?retryWrites=true&w=majority&appName=TicketBC'; 
const dbName = 'USERBC'; 
const collectionName = 'Users'

const secretKey = 'kronos'; 

async function connectToDatabase() {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  return db;
}



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection(collectionName);

    // Trova l'utente nel database per username
    const user = await usersCollection.findOne({ username: username });

    // Verifica che l'utente esista e che la password sia corretta
    if (user && user.password === password) { // Qui dovresti usare un hash della password per sicurezza
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' }); // Token valido 1 minuto
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false,  // Assicurati di cambiarlo in 'true' in produzione
        sameSite: 'strict',
        maxAge: 60 * 1000,
      });
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Errore durante la connessione al database:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Verifica che i campi non siano vuoti
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection(collectionName);

    // Controlla se l'utente esiste già
    const userExists = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username o email già in uso' });
    }

    // Crea un nuovo utente (senza criptare la password)
    const newUser = {
      username,
      email,
      password,  
    };

    // Salva l'utente nel database
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server' });
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