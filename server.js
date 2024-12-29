const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); 





const app = express();
const port = 3001;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'losd3108',
    database: 'crud_app',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.message);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Middleware para manejar JSON
app.use(bodyParser.json());
app.use(cors()); 

// Operaciones CRUD
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      console.error('Error al obtener todos: ' + err.message);
      res.status(500).send('Error al obtener todos');
    } else {
      res.json(results);
    }
  });
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;

  db.query('INSERT INTO todos (text) VALUES (?)', [text], (err, result) => {
    if (err) {
      console.error('Error al agregar todo: ' + err.message);
      res.status(500).send('Error al agregar todo');
    } else {
      res.json({ id: result.insertId, text });
    }
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  db.query(
    'UPDATE todos SET text = ? WHERE id = ?',
    [text, id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar todo: ' + err.message);
        res.status(500).send('Error al actualizar todo');
      } else {
        res.json({ id: parseInt(id), text });
      }
    }
  );
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar todo: ' + err.message);
      res.status(500).send('Error al eliminar todo');
    } else {
      res.json({ id: parseInt(id) });
    }
  });
});

