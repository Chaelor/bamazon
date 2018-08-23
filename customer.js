//If you want the data associated with this node app, please run the mydb.sql.
//It will create the database, table, use it, and populate it with data.
//Happy shopping! The brandy is nice. 

//NPM installed modules
require("dotenv").config();
const inq = require("inquirer");
const mysql = require("mysql");

//connection to the mysql server
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    //these come from the .env file, which won't be uploaded to git. Use your own
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    //This is the database name.
    database: "bamazon"
});

//This function will read out all the items in the db and prompt the customer to input one to buy
function readProducts() {

    //Connect to the server, list all the items
    connection.query("select * from products", (err, res) => {

        //If there is an error, stop app and display error
        if (err) throw err;

        //for in loop that lists all of the items from the db
        for (let i in res) {
            var id = res[i].id;
            let product = res[i].product_name;
            let price = res[i].price;
            let stock = res[i].stock_quantity;

            //This is the display output for all of the items
            console.log(
                `
==================================
Product ID: ${id}
Product: ${product}
Price: ${price}
Stock Available: ${stock}
==================================`);
        };

        //Ask the customer if they want to buy anything
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

            //If the user confirms this is okay
            if (inqRes.confirm) {
                //If the purchase quantity the user wants is greater than what is listed in the data base, or if the amount in the db = 0
                if (inqRes.purchaseQuantity > res[inqRes.purchaseThis - 1].stock_quantity || res[inqRes.purchaseThis - 1].stock_quantity === 0) {
                    //Repeat this function
                    readProducts();
                    //Tell the customer not enough stock
                    console.log("We had insufficient stock, so we reloaded the list");
                } else {
                    //Sends data to the purchase products function. Product name, Quantity, Price, Current Stock, and ID
                    purchaseProducts(res[inqRes.purchaseThis - 1].product_name, inqRes.purchaseQuantity, res[inqRes.purchaseThis - 1].price, res[inqRes.purchaseThis - 1].stock_quantity, res[inqRes.purchaseThis - 1].id);
                }
            } else {
                //If the user does not confirm, just read off the products again.
                console.log("Alright, here are the prodcuts again");
                readProducts();
            }

        });
    });
};

//This function is called in the readProduct, after the inquirer prompt's response and in 2 if statements. Line 67
function purchaseProducts(purchaseItem, purchaseQuantity, purchasePrice, existingStock, id) {

    //Variables TotalPrice does the math to show what customer owes.
    var totalPrice = purchaseQuantity * purchasePrice;
    //Total stock is used to update the data base.
    var totalStock = existingStock - purchaseQuantity;

    //Displays what the customer bought, how many, price per item, and total price.
    console.log(`==================================\n
Purchase item: ${purchaseItem}
Purchase amount: ${purchaseQuantity}
Price per item: ${purchasePrice}
Total price: $${totalPrice}\n
==================================\n`);

    //Updates the data base according to the data the customer gave
    connection.query(
        //Updates the row associated with the item ID
        `UPDATE products SET stock_quantity = ${totalStock} WHERE id = ${id}`, (err) => {
            if (err) throw err;
            //Telling the customer that their purchase was successful.
            console.log("==================================\nPurchase successful, items on the way\n==================================");
        });
}

//Let's get this show on the road, shall we?
readProducts();

