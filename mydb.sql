drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products(
	id integer(11) auto_increment not null,
    product_name varchar(50) not null,
    department_name varchar(50),
    price float(6,2) not null,
    stock_quantity integer(10) not null,
    primary key (id)
);

insert into products(product_name, department_name, price, stock_quantity)
values("Bananas", "Produce", .75, 23),
("Potates", "Produce", .5, 100),
("Corn", "Produce", .25, 150),
("Steak", "Meat", 5.55, 10),
("Chicken", "Meat", 5.00, 15),
("Tuna", "Meat", 4.55, 7),
("Chips", "Junk", 1.25, 100),
("Pretzels", "Junk", 1.25, 97),
("Marshmellows", "Junk", 1.5, 20),
("Milk", "Dairy", 2.25, 15),
("Yogurt", "Dairy", .75, 80),
("1956_Brandy", "Alcohol", 1999.99, 2);
