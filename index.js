// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Alondra0729',
  port: '3306',
  database: 'test'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());

app.post('/biometricData', (req, res) => {
  const { userId, biometricData } = req.body;
  const sql = 'INSERT INTO BiometricData (userId, biometricData) VALUES (?, ?)';
  db.query(sql, [userId, biometricData], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error saving biometric data' });
    } else {
      res.send({ message: 'Biometric data saved successfully' });
    }
  });
});

app.post('/authenticate', (req, res) => {
  const { userId, biometricData } = req.body;
  const sql = 'SELECT * FROM BiometricData WHERE userId = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Database error' });
    } else {
      const storedBiometricData = result[0].biometricData;
      // Aquí deberías comparar los datos biométricos almacenados con los datos biométricos proporcionados por el usuario
      if (biometricData === storedBiometricData) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
