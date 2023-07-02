-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 20, 2023 at 01:24 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacation-database`
--
CREATE DATABASE IF NOT EXISTS `vacation-database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacation-database`;

-- --------------------------------------------------------

--
-- Table structure for table `airlines`
--

CREATE TABLE `airlines` (
  `airlineId` int(11) NOT NULL,
  `airlineName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `airlines`:
--

--
-- Dumping data for table `airlines`
--

INSERT INTO `airlines` (`airlineId`, `airlineName`) VALUES
(1, 'Turkish Airline'),
(2, 'Israir'),
(3, 'Wizz Airline'),
(4, 'Ryanair'),
(5, 'Blue-Bird Airways'),
(6, 'El-Al'),
(7, 'Arkia');

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

CREATE TABLE `boards` (
  `boardId` int(11) NOT NULL,
  `boardName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `boards`:
--

--
-- Dumping data for table `boards`
--

INSERT INTO `boards` (`boardId`, `boardName`) VALUES
(1, 'Breakfast '),
(2, 'Half Board'),
(3, 'Full Board'),
(4, 'All Inclusive'),
(5, 'none');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `countryId` int(11) NOT NULL,
  `countryName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `countries`:
--

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`countryId`, `countryName`) VALUES
(1, 'Turkey'),
(2, 'Greec'),
(3, 'Cyprus'),
(4, 'Malta'),
(5, 'Italy'),
(6, 'Austria');

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `vacationId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `followers`:
--   `userId`
--       `users` -> `userId`
--   `vacationId`
--       `vacations` -> `vacationId`
--

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`vacationId`, `userId`) VALUES
(48, 2),
(44, 2),
(45, 5),
(37, 5),
(34, 5),
(33, 5),
(44, 5);

-- --------------------------------------------------------

--
-- Table structure for table `luggage`
--

CREATE TABLE `luggage` (
  `luggageId` int(11) NOT NULL,
  `luggageName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `luggage`:
--

--
-- Dumping data for table `luggage`
--

INSERT INTO `luggage` (`luggageId`, `luggageName`) VALUES
(1, 'Trolley'),
(2, 'Trolley and Backpack'),
(3, 'Trolly and Cargo Luggage');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `role` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `roles`:
--

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `role`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `stars`
--

CREATE TABLE `stars` (
  `starsId` int(11) NOT NULL,
  `starsRating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `stars`:
--

--
-- Dumping data for table `stars`
--

INSERT INTO `stars` (`starsId`, `starsRating`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(256) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `users`:
--   `roleId`
--       `roles` -> `roleId`
--

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `roleId`) VALUES
(1, 'Admin', 'Admin', 'brycevaction@gmail.com', 'brycevaction1234', 1),
(2, 'guest', 'guest', 'bryceGuestUser@gmail.com', '0000', 2),
(5, 'oz', 'zrihan', 'oz_zrihan@hotmail.com', '18121987', 2);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `countryId` int(11) NOT NULL,
  `city` varchar(30) NOT NULL,
  `hotel` varchar(50) NOT NULL,
  `starsId` int(11) NOT NULL,
  `boardId` int(11) DEFAULT NULL,
  `airlineId` int(11) NOT NULL,
  `luggageId` int(11) NOT NULL,
  `departureTime` datetime NOT NULL,
  `returnTime` datetime NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `imagesFolder` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `vacations`:
--   `countryId`
--       `countries` -> `countryId`
--   `starsId`
--       `stars` -> `starsId`
--   `boardId`
--       `boards` -> `boardId`
--   `luggageId`
--       `luggage` -> `luggageId`
--   `airlineId`
--       `airlines` -> `airlineId`
--

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `countryId`, `city`, `hotel`, `starsId`, `boardId`, `airlineId`, `luggageId`, `departureTime`, `returnTime`, `price`, `description`, `imagesFolder`) VALUES
(33, 1, 'Istanbul', 'Seres Hotel', 4, 1, 1, 1, '2023-06-16 09:50:00', '2023-06-24 12:35:00', '1439.00', 'Enjoy an amazing location in Istanbul\'s Old City! The Seres Hotel Old City is perfectly situated just a few steps away from Topkapi Palace and Gülhane Park, offering clean and comfortable rooms, free Wi-Fi in the lobby, and a breakfast buffet included in the price. The Sirkeci Marmaray tram and subway station is just 230 meters away, providing easy access to major attractions and shopping centers. The hotel offers a variety of recently refurbished clean and comfortable rooms with air conditioning and en-suite bathrooms. The beautiful rooftop terrace is the perfect place to start your day, where you can enjoy a rich breakfast buffet against the backdrop of Istanbul\'s panoramic view and the Sea of Marmara.', 'seres-hotel'),
(34, 2, 'Rodos', 'Esperos Palace Resort', 4, 1, 2, 1, '2023-06-04 13:10:00', '2023-06-09 16:35:00', '1227.00', 'Family vacation in Rhodes - a resort site on Faliraki Beach.\r\nThe Aspros Palace resort site is located on the magical coastline of Faliraki, a 20-minute drive from the center of Rhodes. The hotel offers a variety of children\'s attractions such as mini-golf and sports activities, as well as 4 swimming pools, including a round kiddie pool for the whole family. We especially loved the hotel\'s main restaurant, which offers themed evenings according to different cuisines, with the chefs preparing the dishes in front of the diners. The hotel also has a Greek a la carte restaurant and bars serving snacks and appetizers alongside beers and cocktails.', 'esperos-palace-resort'),
(35, 2, 'Crete', 'Elounda Bay Palace', 5, 2, 3, 1, '2023-06-05 18:10:00', '2023-06-09 17:00:00', '1502.00', 'A modern vacation with a view of Mirabello Bay\r\nIt is a 5-star modern hotel overlooking Mirabello Bay; the hotel is located just a few minutes away from the beaches and the fishing village of Elounda. The hotel provides a variety of large, comfortable and well-designed accommodation rooms. Certain rooms include balconies with direct access to the pool. Enjoy an al fresco meal under the sky while facing the view of the pool and panoramic view of the sea in Mirabello Bay. The hotel\'s restaurant offers a variety of seafood dishes, and its additional restaurant, Aretoussa, specializes in cooking Greek and international cuisine. The hotel offers a wide range of beauty treatments. Hotel facilities include a fitness room, tennis court, indoor swimming pool, and outdoor swimming pool.', 'elounda-bay-palace'),
(36, 4, 'San Giljan', 'H Hotel', 4, NULL, 4, 1, '2023-06-14 22:25:00', '2023-06-21 17:30:00', '1417.00', 'A couple\'s vacation in Malta - Adults-only central hotel.\r\nHotel H is an adults-only hotel offering luxurious accommodation located just 10 minutes from the city center in the heart of Paceville - Malta\'s entertainment and nightlife district, packed with clubs, restaurants, bars, and pubs that are open until the wee hours of the night. The hotel is within a short walking distance from the beaches of St. George\'s Bay and the marina. Guests can enjoy a fantastic rooftop pool with an attractive pool bar and a great spa area with relaxing facilities, a covered pool, and a beauty and grooming salon.', 'h-hotel'),
(37, 2, 'Santorini ', 'Gizis Exclusive', 4, 1, 3, 1, '2023-06-09 16:45:00', '2023-06-12 10:35:00', '1426.00', 'Relaxing vacation in Imerovigli Cliff - Santorini.\r\nGizis Exclusive accommodation enjoys an excellent location on the cliff of Imerovigli and offers a pool with views of the volcanic mountain. The rooms and suites are designed in a traditional style and offer a private balcony, from which you can enjoy beautiful views of the volcanic mountain and sunset. The rooms are also equipped with a flat-screen TV and hairdryer. You can enjoy breakfast by the pool, or relax on the terrace and enjoy uninterrupted views of the sea and the volcanic mountain. The place is located on the main road from Fira to Oia, allowing easy access by car to these villages. There is also a bus stop just 50 meters away.', 'gizis-exclusive'),
(38, 1, 'Istanbul', 'Noble22 Suites', 4, NULL, 1, 1, '2023-06-16 09:50:00', '2023-06-24 12:35:00', '2228.00', 'Urban vacation in Istanbul - an elegant hotel in a central location.\r\nThe Noble22 Suites hotel enjoys one of the best locations in Istanbul, just a five-minute walk from the bustling Istiklal Street and the central Taksim Square. The subway station and the ferry port are within a short walking distance. The hotel offers elegant boutique luxury accommodation in an ideal location for tourists who like to be close to everything the city has to offer. The reception desk is open 24 hours a day and offers concierge service, personal assistance, and taxi booking.', 'noble22-suites'),
(39, 2, 'Thessaloniki', 'The Excelsior', 5, 1, 4, 1, '2023-06-05 11:55:00', '2023-06-09 07:25:00', '1281.00', 'Vacation in Thessaloniki - Luxury hotel in the best location in town.\r\nExcelsior Hotel is the one and only hotel in the Small Luxury Hotels of the World chain in Thessaloniki, located right in the heart of the city. The accommodation offers elegant suites and rooms with wooden floors and a balcony overlooking the city center, as well as an espresso machine, a minibar, a flat-screen TV, and a radio with an iPod connection. All bathrooms include bathrobes and complimentary toiletries. A buffet breakfast and à la carte lunch are served daily at the Charlie D. Brasserie at Mezzanine restaurant, which offers Mediterranean and international flavors. The hotel is located near Aristotelous Square, the central hub for business, shopping, and leisure, and is only a short walk away from the boutiques of Mitropoleos.', 'the-excelsior'),
(40, 1, 'Antalya', 'Asteria Kremlin Palace', 5, 1, 1, 1, '2023-06-02 21:05:00', '2023-06-08 10:15:00', '2015.00', 'Family vacation to Antalya beaches.\r\nThe Astoria Kremlin Palace resort, inspired by the original Kremlin palace in Russia, allows you to discover the home of the Russian tsars. This all-inclusive resort offers a private beach and a wide selection of 5-star pools and water sports facilities, as well as 6 a la carte restaurants and 7 bars, as well as special entertainment for children. You can relax and rejuvenate in the fully equipped spa center and receive reflexology treatments, massages, sea algae treatments and more. You can also relax in the sauna and Turkish bath. The hotel has a water park with three slides for children and a water park for adults with 6 slides. You can also take dance lessons, practice archery, or visit nearby caves.', 'asteria-kremlin-palace'),
(41, 2, 'Santorini', 'Petit Palace', 4, 1, 3, 1, '2023-06-09 16:45:00', '2023-06-12 10:35:00', '2288.00', 'The romantic vacation you\'ve always dreamed of!\r\nPetit Palace Suites Hotel Bay Caldera Collection is located on the edge of the volcanic Mount Loe, in the area of Agia Irini. The resort is situated 150 meters above sea level and offers suites with private pools and stunning views of the volcanic mountain. The spacious and carved-in-rock suites are furnished with designer furniture and feature Cycladic-style design. All are equipped with luxury amenities and include a hydromassage bathtub. The Elia restaurant serves Mediterranean cuisine in a romantic atmosphere. In addition, the hotel has an elegant pool bar where guests can enjoy cocktails. A certified Greek breakfast is served in the morning. The hotel is conveniently located just 2 km from Fira, which offers a wealth of restaurants, bars, and shops.', 'petit-palace'),
(42, 2, 'Rodos', 'Rodos Palace Hotel', 5, 1, 2, 1, '2023-06-16 13:50:00', '2023-06-23 16:35:00', '1663.00', 'A luxurious vacation on the beaches of Rhodes!\r\nThe Rodos Palace Hotel is located in a fantastic area by the Aegean Sea and offers a wide range of stylish suites and accommodations, 5 outdoor pools, 4 restaurants, a bar, and terraces. With 14 picturesque buildings featuring garden suites, the spacious and exquisitely designed suites are perfect for families and couples seeking privacy. The suites and rooms have been uniquely redesigned and offer modern conveniences. You can enjoy a wide variety of dining options, including authentic and outdoor restaurants serving excellent Greek and European cuisine.', 'rodos-palace-hotel'),
(43, 4, 'San Giljan', 'Golden Tulip Vivaldi Hotel', 4, NULL, 4, 1, '2023-06-07 22:25:00', '2023-06-14 17:30:00', '1266.00', 'City vacation in Malta - a luxurious hotel adjacent to the beach.\r\nAn elegant and luxurious hotel located in the center of St. Julian, a 2-minute walk from the beach. The hotel offers a great spa area with swimming pools, sauna, jacuzzi, and fitness room. The bustling Paceville district is a 5-minute walk away, where you will find a variety of bars, restaurants, and clubs. The hotel offers two great and luxurious restaurants. At the \"Story of Infinity\" restaurant, you can enjoy a rich buffet and a wide wine list, while at the \"El Stimo Sailo\" restaurant, which is open in the summer, you can enjoy grilled dishes and pizza in a tabun oven.', 'golden-tulip-vivaldi-hotel'),
(44, 2, 'Kos', 'Mitsis Ramira Beach Hotel', 5, 4, 5, 3, '2023-06-22 14:05:00', '2023-06-26 11:20:00', '1925.00', 'A vacation in Psaillidi Beach, Kos.\r\nThe Ramira Beach Hotel by Mitsis is located on its private stretch of beach in Psaillidi, just 3.5 km from the town of Kos. On the beach, next to the two pools of the accommodation, you can enjoy free sun loungers and umbrellas. One of the pools includes hydro massage loungers. The modern air-conditioned guest rooms include a small refrigerator and a balcony or terrace with garden furniture. The main restaurant serves an American breakfast buffet, lunch, and dinner. Special themed evenings include Greek, Asian, Mediterranean, and Mexican motifs. There is also a steakhouse, an Italian restaurant, and 5 bars. Young guests can enjoy a children\'s pool, playground, and a game room. The entertainment team organizes games, performances, and competitions.', 'mitsis-ramira-beach-hotel'),
(45, 3, 'Limassol', 'Ajax Hotel', 4, 1, 6, 1, '2023-06-02 15:30:00', '2023-06-07 17:55:00', '1026.00', 'Luxurious Cyprus vacation!\r\nThe 4-star Ajax hotel is located in an ideal location in the heart of the city. The accommodation is located near the shopping streets and major attractions, such as the archaeological museum, the old town, and the medieval castle. The hotel rooms are air-conditioned and include a balcony overlooking the hotel garden or the city, as well as a private bathroom with a hairdryer. You can enjoy a drink or a light snack at Ulysses\' Bar - Cafe and Terrace. For more formal meals, you can enjoy the flavors of international and Cypriot cuisine at Ekavi restaurant. At the Ayana spa, there is a variety of facial and body treatments, influenced by Japanese culture. The spa includes a sauna, treatment rooms, and professional guidance from certified fitness trainers.', 'ajax-hotel'),
(46, 2, 'Crete', 'Stella Village Hotel & Bungalows', 4, 4, 7, 1, '2023-06-12 13:10:00', '2023-06-18 13:00:00', '1849.00', 'A relaxing beach vacation in Hersonissos.\r\nThe Stella Village resort is located just 10 meters from its private beach in Analipsi, Hersonissos, and offers 2 swimming pools with bars near the pool surrounded by lush gardens, 2 restaurants, 2 tennis courts, and a children\'s club. The spacious and bright rooms feature a furnished balcony overlooking the gardens, a refrigerator, and air conditioning. The buffet restaurant serves meat, fish, and vegetarian dishes. Special themed evenings are organized every week. Coffee, snacks, and drinks are offered at the 2 bars near the pool, which play music in the evenings. There are water aerobics classes, a football field, and beach volleyball facilities. Younger guests can enjoy 3 children\'s pools, playground equipment, or participate in games organized by the entertainment team.', 'stella-village'),
(47, 1, 'Istanbul', 'Almina Hotel Special Class', 4, 1, 1, 1, '2023-06-13 11:10:00', '2023-06-20 19:10:00', '1605.00', 'In the center of Istanbul with a view of the sea!\r\nThe Almina Hotel - Special Class, located in the heart of historic Istanbul, just a few steps away from the Blue Mosque and Hagia Sophia, offers well-equipped rooms with free Wi-Fi. The hotel staff will welcome you with a complimentary fruit basket and a beverage upon arrival. The luxurious accommodations include modern amenities, such as free wireless internet and satellite TV. You can explore the historic Sultanahmet district and visit famous sites such as Topkapi Palace and the Grand Bazaar.', 'almina-hotel-special-class'),
(48, 1, 'Antalya', 'Sealife Family Resort Hotel', 5, 4, 1, 1, '2023-06-01 13:10:00', '2023-06-04 19:25:00', '1065.00', 'Family vacation to the beaches of Antalya.\r\nThe Sealife Family Resort Hotel is located right in front of Konyaalti Beach, which carries the blue flag, and offers a wide range of facilities and activities for the whole family. It includes pools with slides, a spa with body treatments, and equipment for diving and snorkeling. You can choose from various restaurants, serving Ottoman specialties and seafood. There are also several bars, a disco club, and a bar-bistro on site. In addition, the site offers a kids\' club with a professional staff and invites you to enjoy tennis courts, a sauna, and a traditional Turkish hammam.', 'sealife-family-resort-hotel'),
(63, 1, 'Istanbul', 'Crowne Plaza Istanbul', 5, 5, 1, 3, '2023-04-18 10:10:00', '2023-04-22 19:10:00', '858.00', 'Luxury vacation in an excellent location\nThe Crown Plaza Hotel, located near the Grand Bazaar in Istanbul, includes an indoor pool, spa, fitness room and more. You can also enjoy a restaurant in the hotel, breakfast and other facilities for the guests\' comfort.', 'crowne-plaza-istanbul'),
(64, 2, 'Athens', 'Wyndham Grand Athens', 5, 5, 7, 1, '2023-05-02 14:45:00', '2023-05-09 18:05:00', '2425.00', 'The modern Wyndham Grand Athens hotel is located just a few steps away from the Metaxourgeio metro station and boasts an outdoor rooftop pool and a bar-restaurant with panoramic views of the Acropolis, Lycabettus Hill, and the Saronic Gulf. Guests can indulge in the spa center, work out at the fully equipped fitness center, or enjoy a drink at the terrace bar that operates throughout the day. The suites and accommodations offer elegant design and include air conditioning, a minibar, espresso machine, bathrobes, a hairdryer, and branded toiletries.', 'wyndham-grand-athens'),
(65, 3, 'Larnaca', 'Golden Bay Beach Hotel', 5, 1, 7, 1, '2023-08-05 12:00:00', '2023-08-09 15:30:00', '1768.00', 'The Golden Beach Bay resort is located on a strip of beach in the city of Larnaca, surrounded by green gardens, manicured lawns, and a tropical village atmosphere by the sea. The hotel offers four swimming pools with a water park and plenty of facilities for both children and adults. The hotel\'s great dining options include four excellent restaurants, including the Greek grill restaurant Petrino Tavern. While children enjoy the range of activities and attractions offered by the hotel, adults can indulge in the luxurious spa area.', 'golden-bay-beach-hotel'),
(66, 2, 'Crete', 'Alexander Beach Hotel & Resort', 5, 1, 7, 1, '2023-04-20 08:30:00', '2023-04-27 16:20:00', '1423.00', 'The Alexander Beach Hotel is located on the enchanting strip of beach in Malia, in a quiet and peaceful surroundings with a beautiful virgin beach that is perfect for relaxing during the day. The family rooms are large and spacious, and there are plenty of attractions and activities for children. We really enjoyed the vast spa complex, which covers an area of ​​1,000 square meters and includes a covered pool, Jacuzzi, sauna, Turkish bath, facial and body treatments, beauty salon, relaxation trellis and more. The hotel has 3 restaurants: a taverna for the evening, an authentic Greek restaurant, and an international restaurant with a sea view', 'alexander-beach-hotel-&-resort'),
(67, 2, 'Athens', 'Grecotel Pallas Athena', 5, 1, 5, 1, '2023-05-20 10:00:00', '2023-05-24 11:55:00', '1958.00', 'The Grecotel Pallas Athena hotel is centrally located next to the Athens City Hall building. The hotel offers uniquely designed accommodations with artistic details. The facilities include a restaurant and a bar. All the air-conditioned rooms and suites at the hotel offer personalized design and carefully selected items, as well as a flat-screen TV. Each unit provides a minibar and a hairdryer. The impressive Plaka area, as well as the popular view of the Acropolis, the Acropolis Museum, and the central Syntagma Square, are within a short walking distance.', 'grecotel-pallas-athena'),
(68, 2, 'Athens', 'Electra Palace Athens', 5, 1, 5, 1, '2023-04-28 08:50:00', '2023-05-05 17:00:00', '3526.00', 'The Electra Palace Athens hotel is located in one of the most recommended locations in Athens: the vibrant Plaka district. Within a short walking distance from the hotel, you can easily reach most of the city\'s important attractions and sites, such as the Jewish Museum, the Cathedral of Athens, and the Acropolis. We particularly loved the Greek breakfast, which is a wonderful way to start the day, and the hotel\'s rooftop, where there is a swimming pool, a seating area, and a Mediterranean restaurant with a view of the Acropolis. The hotel offers a spa complex with a sauna and an indoor pool.', 'electra-palace-athens'),
(69, 2, 'Corfu', 'Rodostamo Hotel & Spa', 5, 1, 2, 1, '2023-05-25 14:10:00', '2023-05-28 17:50:00', '1348.00', 'Rodostamo Hotel & Spa- Adults Friendly is a 5-star hotel that includes a seasonal outdoor pool, a furnished sun terrace with views of Kommeno Bay, concierge service, and 24-hour room service. Most of the bungalows are equipped with an outdoor Jacuzzi, and all villas have a private heated pool with a sun terrace and sun loungers. All rooms include a private bathroom with a hairdryer and branded toiletries. The main a-la-carte restaurant serves dishes from the Mediterranean cuisine. The spa and health center are always at your disposal.', 'rodostamo-hotel-&-spa'),
(70, 2, 'Kassandreia', 'Kassandra Palace Hotel & Spa', 5, 1, 2, 1, '2023-05-01 08:45:00', '2023-05-04 10:30:00', '839.00', 'The Kassandra Palace Hotel & Spa is a 5-star hotel located next to a private sandy beach in Kriopigi. You can enjoy the tranquil atmosphere provided by the hotel\'s gardens and the four bars, two restaurants, spa and health center, three shared pools, kids\' club, and a variety of leisure options. The hotel\'s spa offers refreshing body treatments, a covered and heated pool, a sauna, a hammam, and a massage bath. The sports facilities include a fitness center and a tennis court, and there are also yoga and Pilates classes available. The Mediterranean restaurant, Magnolia, serves fresh local dishes, including a wide selection of vegan and gluten-free options. You can enjoy refreshing cocktails or snacks and drinks in the lobby, by the pool, at the restaurant, or at the hotel\'s beach bar.', 'kassandra-palace-hotel-&-spa'),
(71, 3, 'Protaras', 'Sunrise Jade Adults Only', 5, 1, 7, 1, '2023-04-27 14:00:00', '2023-04-30 19:35:00', '905.00', 'Sunrise Jade Hotel - Adults Only is located on the sandy beach and offers a state-of-the-art spa center and a well-maintained garden, with 2 outdoor pools, one of which is heated. Free Wi-Fi is available throughout the area. All hotel rooms are elegantly furnished and include a terrace or furnished balcony, a shower, and an espresso machine. Air conditioning is included as standard. In the hotel\'s restaurants, you can enjoy classic American gourmet dishes and international cuisine. The Traclyn Bar and the Pool Bar serve a variety of drinks, fresh squeezed juices and refreshing cocktails. The Jade Spa includes three treatment rooms, a sauna, and a heated indoor pool, and yoga classes and diving lessons are also available on-site. Massages and beauty treatments are available for an additional fee.', 'sunrise-jade-adults-only');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airlines`
--
ALTER TABLE `airlines`
  ADD PRIMARY KEY (`airlineId`);

--
-- Indexes for table `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`boardId`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`countryId`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `luggage`
--
ALTER TABLE `luggage`
  ADD PRIMARY KEY (`luggageId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `stars`
--
ALTER TABLE `stars`
  ADD PRIMARY KEY (`starsId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`),
  ADD KEY `countryId` (`countryId`),
  ADD KEY `starsId` (`starsId`),
  ADD KEY `boardId` (`boardId`),
  ADD KEY `airlineId` (`airlineId`),
  ADD KEY `luggageId` (`luggageId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `airlines`
--
ALTER TABLE `airlines`
  MODIFY `airlineId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `boards`
--
ALTER TABLE `boards`
  MODIFY `boardId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `countryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `luggage`
--
ALTER TABLE `luggage`
  MODIFY `luggageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stars`
--
ALTER TABLE `stars`
  MODIFY `starsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`);

--
-- Constraints for table `vacations`
--
ALTER TABLE `vacations`
  ADD CONSTRAINT `vacations_ibfk_1` FOREIGN KEY (`countryId`) REFERENCES `countries` (`countryId`),
  ADD CONSTRAINT `vacations_ibfk_2` FOREIGN KEY (`starsId`) REFERENCES `stars` (`starsId`),
  ADD CONSTRAINT `vacations_ibfk_3` FOREIGN KEY (`boardId`) REFERENCES `boards` (`boardId`),
  ADD CONSTRAINT `vacations_ibfk_4` FOREIGN KEY (`luggageId`) REFERENCES `luggage` (`luggageId`),
  ADD CONSTRAINT `vacations_ibfk_5` FOREIGN KEY (`airlineId`) REFERENCES `airlines` (`airlineId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
