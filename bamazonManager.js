var mysql = require("mysql");
var inquirer = require("inquirer");

//var item;
//var quantity;

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

// prompt user to action
function start(){
  console.log("===============================================================");
  console.log("Welcome to the Bamazon Manager Application.");
  
  inquirer.prompt({
    name: "managerList",
    type: "list",
    message: "Choose an action on store inventory: ",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Current Inventory", "Add New Product"]
  }).then(function(answer) {
    console.log("===============================================================");
    // based on their answer, either call the bid or the post functions
    switch(answer.managerList){
      case "View Products for Sale":
        viewInventory();
      break;

      case "View Low Inventory":
        viewLowInventory();
      break;

      case "Add to Current Inventory":
        addInventory();
      break;

      case "Add New Product":
        addNewProduct();
      break;
    }
  });
}

function viewInventory(){
  console.log("===============================================================");
  console.log("View All Products For Sale:\n");

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
    start();  
  });
}

function viewLowInventory(){
  console.log("===============================================================");
  console.log("View Low Inventory:\n");

  dbconn.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
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
    start();  
  });

}

function addInventory(){
  console.log("===============================================================");
  console.log("Add To Current Inventory:\n");
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
      // prompt questions
      inquirer.prompt([
      {
        name: "user_item_ID",
        type: "input",
        message: "Inventory Item To Update:",
        validate: function(str) {
          // error check to validate item ID is in range
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
        message: "How many do you wish to add to current inventory:",
        // error check to validate enough items are in stock for the order
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          } else{
          return "Please enter a valid value for the number of items you wish to add to current inventory";
        }
       }
     }
    ]).then(function(answer) {
      var upd_qty = parseInt(results[item-1].stock_quantity) + parseInt(answer.user_quantity);
      dbconn.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: upd_qty
          },
          {
            item_id: answer.user_item_ID
          }
        ],
        function(error) {
          // if error, show error
          if (error) throw err;
          // else successful, run order summary and restart from beginning
          console.log(answer.user_quantity + " " + results[item-1].product_name + " have been added to inventory.");
          start();
        }
      );
    });
  });
}

function addNewProduct(){
  console.log("===============================================================");
  console.log("Add New Product:\n");
  // prompt for info about new item
  inquirer.prompt([
    {
      name: "itemName",
      type: "input",
      message: "Item Name: "
    },
    {
      name: "itemPrice",
      type: "input",
      message: "Item Price: ",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }else{
        return "Please enter a valid item numerical price";
        }
      }
    },
    {
      name: "itemQuantity",
      type: "input",
      message: "Initial Quantity: ",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }else{
        return "Please enter a valid numerical initial qantity";
      }
    }
    },
    {
      name: "department",
      type: "input",
      message: "Related Department: "
    }
  ]).then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    dbconn.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.itemName,
        price: answer.itemPrice,
        stock_quantity: answer.itemQuantity,
        department_name: answer.department
      },
      function(err) {
        if (err) throw err;
        console.log("Product: '" + answer.itemName + "' added successfully!");
        console.log("===============================================================");
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
  });
}