DROP DATABASE IF EXISTS salemanagement;
CREATE DATABASE SaleManagement;

USE salemanagement;
CREATE TABLE tblCategory (
	categoryId INT PRIMARY KEY,
	categoryName VARCHAR(255) UNIQUE NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tblProduct (
	productId INT PRIMARY KEY,
	categoryId INT,
	productName VARCHAR(255) UNIQUE NOT NULL,
	price DECIMAL(5, 2) NOT NULL,
	IMAGE LONGTEXT,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (categoryId) REFERENCES tblCategory (categoryId)
);

CREATE TABLE tblSale (
	saleId INT PRIMARY KEY,
	saleDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tblSaleDetail (
	sdId INT AUTO_INCREMENT PRIMARY KEY,
	saleId INT,
	productId INT,
	price DECIMAL(5,2) NOT NULL,
	qty INT NOT NULL,
	FOREIGN KEY (saleId) REFERENCES tblSale (saleId) ON DELETE CASCADE,
	FOREIGN KEY (productId) REFERENCES tblProduct (productId)
);

-- triggers
DELIMITER $$ ;

CREATE TRIGGER Delete_Category
BEFORE DELETE
ON tblcategory
FOR EACH ROW
BEGIN
	UPDATE tblproduct
	SET tblproduct.categoryId = NULL
	WHERE tblproduct.categoryId = OLD.categoryId;
END $$

CREATE TRIGGER Delete_Product
BEFORE DELETE
ON tblproduct
FOR EACH ROW
BEGIN
	UPDATE tblsaledetail
	SET tblsaledetail.productId = NULL
	WHERE tblsaledetail.productId = OLD.productId;
END $$

DELIMITER ;

-- views
CREATE VIEW vAllProducts AS
SELECT tblproduct.productId,
tblproduct.productName, 
tblcategory.categoryName, 
tblproduct.price,
tblproduct.createdAt,
tblproduct.image,
tblcategory.categoryId 
FROM tblproduct
LEFT JOIN tblcategory ON tblcategory.categoryId = tblproduct.categoryId;

CREATE VIEW vProduct_PrimaryKey AS
SELECT 
	IF (COUNT(tblproduct.productId) > 0
			, MAX(tblproduct.productId) + 1
			, 1
	 	 )
	AS id
FROM tblproduct;

CREATE VIEW vCategory_PrimaryKey AS
SELECT 
	IF (COUNT(tblcategory.categoryId) > 0
			, MAX(tblcategory.categoryId) + 1
			, 1
	 	 )
	AS id
FROM tblcategory;

CREATE VIEW vSale_PrimaryKey AS
SELECT 
	IF (COUNT(tblsale.saleId) > 0
			, MAX(tblsale.saleId) + 1
			, 1
	 	 )
	AS id
FROM tblsale;