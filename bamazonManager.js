const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('easy-table');
// Connect to database
var connection = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'root',
  password : 'root1',
  database : 'amazon_DB'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});

function menu() {
  inquirer
  .prompt( {
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Logout"]
  }).then(function(answer) {
    switch (answer.menu) {
      case "View Products for Sale":
        return viewProducts();

      case "View Low Inventory":
        return viewLow();

      case "Add to Inventory":
        return addInventory();

      case "Add New Product":
        return addProduct();

      case "Logout":
        return logout();
    }
  });
};

// Define function to view available products
function viewProducts() {
  connection.query('SELECT * FROM products', function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n All available products: \n");
    for (var i = 0; i < results.length; i++) {
      console.log(
        results[i].itemID + " " + 
        results[i].productName + " [" + 
        results[i].price + "] Qty: " + 
        results[i].stockQuantity
      );
    }
    console.log("\n--------------\n");
    menu();
  })
};

// Define function to view low inventory
function viewLow() {
  connection.query('SELECT * FROM `products` WHERE `stockQuantity` < 5', function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\nYou will soon sell out of the following:\n");
    for (var i=0; i < results.length; i++) {
      console.log( 
        results[i].itemID + " " + 
        results[i].productName + 
        results[i].price + " [Remaining quantity: " + 
        results[i].stockQuantity + "]"
      );
    }
    console.log("\n--------------\n");
    menu();
  })
};

// Define function to increase a product's current inventory
function addInventory() {
  inquirer.prompt( [{
    name: "itemID",
    type: "input",
    message: "Enter an item ID for which to increase inventory"
  }, {
    name: "quantity",
    type: "input",
    message: "Enter quantity of items to ADD"
  }]).then(function(answer) {
    var sql = "UPDATE products SET stockQuantity = " + answer.quantity + " WHERE itemID = " + answer.itemID;
        connection.query(sql, function(err, result) {
      console.log("\n" + result + " product updated!");
      console.log("\n--------------\n");
      menu();
    })
  })
};

// Define function to add a new product
function addProduct() {
  // Create an inquirer prompt to retreive values to create item
  inquirer.prompt([{
    name: "name",
    type: "input",
    message: "Enter the name of the product you wish to add."
  }, {
    name: "department",
    type: "list",
    message: "Select the department in which to list your item.", 
    choices: ["Apparel", "Home & Kitchen", "Grocery", "Entertainment", "Seasonal"]
  }, {
    name: "price",
    type: "input",
    message: "Enter the unit price for your item."
  }, {
    name: "quantity",
    type: "input",
    message: "Enter the available quantity for your item."
  }]).then(function(answer) {
    var sql = "INSERT INTO `products` (productName, departmentName, price, stockQuantity) VALUES ";
    var values = "('" + answer.productName + "', '" + answer.departmentName + "', " + answer.price + ", " + answer.stockQuantity + ")";
    connection.query(sql + values, function(err, result) {
      console.log("\n" + result + " product added!");
      console.log("\n--------------\n");
      menu();    
    })
  })
};

function logout() {
  connection.end();
}

menu();