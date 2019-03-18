const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('easy-table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root1",
  database: "amazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  displayTable();
  });

  function displayTable() {
    connection.query("SELECT * FROM products", function(error, results) {

        if (error) throw error;
        console.log("\n\n");
        // Using easy-table package to display in a table format

         var t = new Table;

        results.forEach(function(product) {
          t.cell('Item_name', product.itemID);
          t.cell('Product_name', product.productName);
          t.cell('Department_name', product.departmentName);
          t.cell('Price', product.price);
          t.cell('Stock_quantity', product.stockQuantity)
          t.newRow();

          
        });
        console.log(t.toString()); 
        inquirer.prompt([{
            type: 'input',
            name: 'productName',
            message: 'Enter the Item Id you would like to buy?',

        }, {
            type: 'input',
            name: 'quantity',
            message: 'Enter how many units you would like to buy?',


        }]).then(function(answers) {

            connection.query("SELECT * FROM products WHERE ?", {productName: answers.productName}, function(error, results) {

                if (results[0].stockQuantity < answers.quantity) {
                  console.log("\n\n\n\n\n")
                    console.log("Insufficient quantity!");
                    
                } else { 
                        
                    console.log("Thank you for your patronage! Your order of "+ answers.quantity + " " + results[0].productName + " is now being processed.");
                    console.log("Your total is: $" + (answers.quantity * results[0].price));
                        };
                    continueShopping();
                   
             
               })
          })
        })
      };
//---- function to ask if customer wants to continue shop ----//
function continueShopping(){
    inquirer
    .prompt([
        {
            name: "input",
            type: "confirm",
            message: "Would you like to continue shopping? "
        
        }
    ])
    .then(function (shopping) {
        if (shopping.input) {
            displayTable();
        }
        else {
            exitBamazon();
        }
    });
};
//---- function to exit the app ----//
function exitBamazon(){
connection.end();
console.log("Thank you for shopping! Please shop again!");
    console.log("Goodbye!!!");
};
