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
  console.log("View All Inventory:\n");

}

function viewLowInventory(){
  console.log("===============================================================");
  console.log("View Low Inventory:\n");

}

function addInventory(){
  console.log("===============================================================");
  console.log("Add To Current Inventory:\n");
  
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
      message: "Item Price: "
    },
    {
      name: "itemQuantity",
      type: "input",
      message: "Initial Quantity: "
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