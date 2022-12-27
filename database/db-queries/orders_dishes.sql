CREATE DATABASE  IF NOT EXISTS `delilah_resto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `delilah_resto`;
-- MySQL dump 10.13  Distrib 8.0.29, for macos12 (x86_64)
--
-- Host: localhost    Database: testing-delilah
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Orders_dishes`
--

DROP TABLE IF EXISTS `Orders_dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders_dishes` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Order_id` int DEFAULT NULL,
  `Dish_id` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK=>Orders_dishes.Order_id-Orders.ID` (`Order_id`),
  KEY `FK=>Orders_dishes.Dish_id-Dishes.ID` (`Dish_id`),
  CONSTRAINT `FK=>Orders_dishes.Dish_id-Dishes.ID` FOREIGN KEY (`Dish_id`) REFERENCES `Dishes` (`ID`),
  CONSTRAINT `FK=>Orders_dishes.Order_id-Orders.ID` FOREIGN KEY (`Order_id`) REFERENCES `Orders` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders_dishes`
--