
//NPM installed modules
require("dotenv").config();
const inq = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "bamazon"
});

function readProducts() {
    connection.query("select * from products", (err, res) => {
        if (err) throw err;
        console.log(res);
    });
};

readProducts();