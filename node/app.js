const express = require('express');
const mysql = require('mysql');
const faker = require('faker');

const app = express();
const port = 3000;
const host = '0.0.0.0'

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'myapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

app.get('/', (req, res) => {
    const name = faker.name.findName();
    connection.query(`INSERT INTO people (name) VALUES ('${name}')`, (err, result) => {
      if (err) {
        console.error('Error inserting name into MySQL:', err);
        res.status(500).send('Error inserting name into database');
        return;
      }
      res.send('<h1>Full Cycle Rocks!</h1><br><h2>Names:</h2><ul>');
      connection.query('SELECT * FROM people', (err, results) => {
        if (err) {
          console.error('Error getting names from MySQL:', err);
          res.status(500).send('Error getting names from database');
          return;
        }
        results.forEach((result) => {
          res.write(`<li>${result.name}</li>`);
        });
        res.end('</ul>');
      });
    });
  });

app.listen(port, host, () => {
  console.log(`App listening at http://localhost:${port}`);
});
