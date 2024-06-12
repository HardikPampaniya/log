-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 12, 2024 at 11:35 AM
-- Server version: 5.7.36
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `log_sys`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(20) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1488 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_id`, `product_name`, `quantity`, `price`) VALUES
(1487, '1020', 'Digital Camera', 9, 400.00),
(1486, '1019', 'Smartwatch', 14, 200.00),
(1485, '1018', 'VR Headset', 7, 350.00),
(1484, '1017', 'Gaming Chair', 5, 250.00),
(1483, '1016', 'Microphone', 15, 60.00),
(1482, '1015', 'Desk Lamp', 19, 45.00),
(1481, '1014', 'External Battery Pack', 28, 35.00),
(1480, '1013', 'Router', 22, 80.00),
(1479, '1012', 'USB Flash Drive', 50, 20.00),
(1478, '1011', 'Web Camera', 40, 75.00),
(1477, '1010', 'Speakers', 10, 150.00),
(1476, '1009', 'Printer', 18, 500.00),
(1475, '1008', 'External Hard Drive', 18, 120.00),
(1474, '1007', 'Monitor', 12, 300.00),
(1473, '1006', 'Mouse', 35, 30.00),
(1472, '1005', 'Keyboard', 25, 50.00),
(1471, '1004', 'Headphones', 30, 100.00),
(1470, '1003', 'Tablet', 150, 400.00),
(1469, '1002', 'Smartphone', 20, 600.00),
(1468, '1001', 'Laptop', 100, 1000.00);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
