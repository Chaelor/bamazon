
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

        for (let i in res) {
            var id = res[i].id;
            let product = res[i].product_name;
            let price = res[i].price;
            let stock = res[i].stock_quantity;
            console.log(
                `
==================================
Product ID: ${id}
Product: ${product}
Price: ${price}
Stock Available: ${stock}
==================================`);
        }
        inq.prompt([
            {
                type: "input",
                message: "Which product would you like to purchase? Use Product ID, please\n",
                name: "purchaseThis"
            },
            {
                type: "input",
                message: "How many of said item would you like?\n",
                name: "purchaseQuantity"
            },
            {
                type: "confirm",
                message: "Are you sure?\n",
                name: "confirm",
                default: true
            }
        ]).then((inqRes) => {

            if (inqRes.confirm) {
                if (inqRes.purchaseQuantity > res[inqRes.purchaseThis - 1].stock_quantity) {
                    readProducts();
                    console.log("We had insufficient stock, so we reloaded the list");
                } else {
                    purchaseProducts(res[inqRes.purchaseThis - 1].product_name, inqRes.purchaseQuantity, res[inqRes.purchaseThis - 1].price, res[inqRes.purchaseThis - 1].stock_quantity, res[inqRes.purchaseThis - 1].id);
                }
            } else {
                console.log("Alright, here are the prodcuts again");
                readProducts();
            }

        });
    });
};


function purchaseProducts(purchaseItem, purchaseQuantity, purchasePrice, existingStock, id) {
    console.log(`Purchase item: ${purchaseItem}`);
    console.log(`Purchase amount: ${purchaseQuantity}`);
    console.log(`Purchase price per item: ${purchasePrice}`);
    console.log(`Total price: $` + purchaseQuantity * purchasePrice);

    var totalStock = existingStock - purchaseQuantity;

    //Updates the data base according to the data the customer gave
    connection.query(
        `UPDATE products SET stock_quantity = ${totalStock} WHERE id = ${id}`, (err) => {
            if (err) throw err;
            console.log("Purchase successful, items on the way");
        })
}
readProducts();

