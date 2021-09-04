const mysql = require('mysql2');

const Database = mysql.createPool({
    host: "13.76.231.248",
    user: "adminkdcgroup",
    password: "Aa1212312121@@##",
    database: 'cal2009',
    port:3306  ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

})

module.exports = Database.promise();