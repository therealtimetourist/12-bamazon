-- Drop bamazon_db if it already exists --
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS bamazon_db;

-- Create a database called programming_db --
CREATE DATABASE bamazon_db;

-- Use programming db for the following statements --
USE bamazon_db;

-- create database user
CREATE USER 'bamazondbuser'@'localhost' IDENTIFIED BY 'drowssap';
GRANT ALL PRIVILEGES ON bamazon_db.* TO 'bamazondbuser'@'localhost';
FLUSH PRIVILEGES;

-- create products table
CREATE TABLE products(
	item_ID integer not null auto_increment,
    product_name varchar(60) not null,
    department_name varchar(60) not null,
    price int(5),
    stock_quantity integer(5) not null,
    primary key(item_ID)
);
        
-- Create new example rows
INSERT INTO products (product_name, department_name, stock_quantity, price)
VALUES	("Desktop PC", "Electronics", 15, 999),
		("Laptop PC", "Electronics", 15, 1299),
        ("PC Monitor", "Electronics", 10, 299),
        ("Potato Chips", "Grocery", 200, 2),
        ("Cookies", "Grocery", 200, 1),
        ("Pen", "Office", 1000, 1),
        ("Pencil", "Office", 1000, 1),
        ("Eraser", "Office", 1000, 1),
        ("T-Shirt", "Clothing", 50, 10),
        ("Jeans", "Clothing", 50, 12),
        ("Tomato", "Grocery", 24, 2);