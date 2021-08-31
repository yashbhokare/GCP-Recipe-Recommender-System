const mysql = require('mysql');

// Database Connection of MySQL of GCP
let config = {
  user: 'root',
  database: '',
  password: '',
  host: '34.67.36.176'
}

let connection = mysql.createConnection(config);
module.exports = connection;
