var mysql = require("mysql");
var inquirer = require("inquirer");

var item;
var quantity;

// create the connection information for the sql database
var dbconn = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "bamazondbuser",

  // Your password
  password: "drowssap",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
dbconn.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// =====================================================================================
// start function. Shows stock in store and guides customer through buying experience

function start(){
  item = 0;
  quantity = 0;
	queryStock();
}
// =====================================================================================

// =====================================================================================
// query stock function.  Shows stock in store
function queryStock(){
  // query all items in the products table
  dbconn.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      // build table header
      console.log("===============================================================");
      console.log("ITEM ID  PRODUCT NAME \t QUANTITY \t PRICE");
      console.log("===============================================================");
      // loop through results/console.log results string
      for (var i = 0; i < results.length; i++) {
          var x = "  ";
              x += results[i].item_ID + " \t ";
              if(results[i].product_name.length < 6){ x += results[i].product_name + " \t\t "}else{ x += results[i].product_name + " \t "}
              x += results[i].stock_quantity + " \t\t ";
              x += results[i].price;
          console.log(x);  
        }

      inquirer.prompt([
      {
        name: "user_item_ID",
        type: "input",
        message: "Please enter the item ID that you wish to purchase:",
        validate: function(str) {
          if (str >= results[0].item_ID && str <= results[results.length-1].item_ID) {
            item = str;
            return true;
          } else{
            return "Please enter a valid item ID";
          }
        }
      },
      {
        name: "user_quantity",
        type: "input",
        message: "Now, please enter the quantity of the item you wish to purchase:",
        validate: function(str) {
          if (str < results[item-1].stock_quantity) {
            return true
          } else{
            return "not enough in stock!  Please enter a valid quantity:";
          }
        }
       }
    ]).then(function(answer) {
      
    });
  });
}
// =====================================================================================

// =====================================================================================
function orderSummary(){

}
// =====================================================================================

function between(x, min, max) {
  if (x >= min && x <= max) {
    return true;
  } else {
    return "Please enter a valid item ID";
  }
}