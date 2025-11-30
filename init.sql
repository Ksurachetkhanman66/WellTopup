-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2025 at 01:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dit312_6601977`
--

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `coverimage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `name`, `coverimage`) VALUES
(101, 'RoV (Arena of Valor)', 'https://content.richmanshop.com/wp-content/uploads/2022/10/New-Skin-16102022_Qi.jpeg'),
(102, 'Garena Free Fire', 'https://cdn12.idcgames.com/storage/image/1258/free-new-logo/default.jpg'),
(103, 'Genshin Impact', 'https://static.gosugamers.net/59/30/7d/5248714d1c995a22cfe85a2389db23409d3f3c5d1cf2aa1177cbacb359.webp?w=1600'),
(104, 'Valorant', 'https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg'),
(105, 'PUBG Mobile', 'https://s.isanook.com/ga/0/ud/213/1066715/image-pubg-01.jpg?ip/crop/w1200h700/q80/jpg'),
(106, 'Honkai: Star Rail', 'https://i.ytimg.com/vi/CRAuK8T6Xis/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDL1Mr5REb8ooszTUUq7x1CAV-EnQ'),
(107, 'Mobile Legends: Bang Bang', 'https://www.wheninmanila.com/wp-content/uploads/2023/03/Mobile-Legends-ALLSTAR-Skin-Miya.png'),
(108, 'Ace Racer', 'https://i.ytimg.com/vi/NAJafBBqkJ0/maxresdefault.jpg'),
(109, 'Call of Duty: Mobile', 'https://i.redd.it/pxmclyug8tla1.jpg'),
(110, 'Roblox', 'https://static.wixstatic.com/media/0a4a01_a0e84b3fa2004f86a1a44decb9cb6462~mv2.webp/v1/fill/w_568,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a4a01_a0e84b3fa2004f86a1a44decb9cb6462~mv2.webp'),
(111, 'Coin Master', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWmTNXBOwjiwFSgis4T8Ro4NZecayaEUq92w&s'),
(112, 'eFootball 2024', 'https://m.media-amazon.com/images/M/MV5BOTdlOGRiZDAtNGQ0NS00ZmVlLTlmMDUtZmU1NWZmZDkxNTZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'),
(113, 'EA SPORTS FC Mobile', 'https://cdn-www.bluestacks.com/bs-images/ea-sports-fc-mobile-soccer-best-player-rb-th-1_banner.jpg'),
(114, 'Ragnarok Origin', 'https://i0.wp.com/news.seagm.com/wp-content/uploads/2023/04/ROO2.png?fit=1085%2C606&ssl=1'),
(115, 'Black Desert Mobile', 'https://s.isanook.com/ga/0/ud/207/1038041/black-desert-mobile.jpg?ip/crop/w1200h700/q80/jpg'),
(116, 'Summoners War', 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2426960/a41dd413a8c76cfaef5fd0593781a3ee51597ad4/capsule_616x353.jpg?t=1759120048'),
(117, 'Clash of Clans', 'https://s.isanook.com/ga/0/ud/197/989699/01.jpg'),
(118, 'League of Legends (PC)', 'https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-47eb328eac5ddd63ebd096ded7d0d5ab'),
(119, 'Garena Undawn', 'https://media.hitekno.com/thumbs/2023/06/22/56184-garena-undawn/730x480-img-56184-garena-undawn.jpg'),
(120, 'Teamfight Tactics (Mobile)', 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/0ad176a172ea82471182d15134fd606bc814d9b8-1920x1080.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `game_items`
--

CREATE TABLE `game_items` (
  `id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_items`
--

INSERT INTO `game_items` (`id`, `game_id`, `name`, `price`) VALUES
(1, 101, '11 คูปอง', 9.50),
(2, 101, '60 คูปอง', 47.50),
(3, 101, '185 คูปอง', 142.00),
(4, 101, '620 คูปอง', 470.00),
(5, 101, '1,240 คูปอง', 942.00),
(6, 102, '33 Diamonds', 10.00),
(7, 102, '172 Diamonds', 50.00),
(8, 102, '310 Diamonds', 90.00),
(9, 102, '1,052 Diamonds', 285.00),
(10, 102, '2,180 Diamonds', 580.00),
(11, 103, '60 Genesis Crystals', 29.00),
(12, 103, 'Welkin Moon', 119.00),
(13, 103, '300 + 30 Crystals', 179.00),
(14, 103, '980 + 110 Crystals', 449.00),
(15, 103, '1,980 + 260 Crystals', 899.00),
(16, 104, '475 VP', 130.00),
(17, 104, '1,000 VP', 260.00),
(18, 104, '2,050 VP', 520.00),
(19, 104, '3,650 VP', 920.00),
(20, 104, '5,350 VP', 1250.00),
(21, 105, '60 UC', 30.00),
(22, 105, '325 UC', 150.00),
(23, 105, '660 UC', 300.00),
(24, 105, '1,800 UC', 750.00),
(25, 105, '3,850 UC', 1450.00),
(26, 106, '60 Oneiric Shard', 29.00),
(27, 106, 'Express Supply Pass', 119.00),
(28, 106, '300 + 30 Shards', 179.00),
(29, 106, '980 + 110 Shards', 449.00),
(30, 106, '1,980 + 260 Shards', 899.00),
(31, 107, '11 Diamonds', 5.00),
(32, 107, '86 Diamonds', 38.00),
(33, 107, '257 Diamonds', 105.00),
(34, 107, 'Twilight Pass', 250.00),
(35, 107, '706 Diamonds', 285.00),
(36, 108, '60 Tokens', 28.00),
(37, 108, '250 Tokens', 107.00),
(38, 108, '680 Tokens', 268.00),
(39, 108, '1,180 Tokens', 482.00),
(40, 108, '2,880 Tokens', 1220.00),
(41, 109, '80 CP', 29.00),
(42, 109, '420 CP', 149.00),
(43, 109, '880 CP', 299.00),
(44, 109, '2,400 CP', 799.00),
(45, 109, '5,000 CP', 1600.00),
(46, 110, '80 Robux', 29.00),
(47, 110, '400 Robux', 150.00),
(48, 110, '800 Robux', 300.00),
(49, 110, '1,700 Robux', 650.00),
(50, 110, '4,500 Robux', 1750.00),
(51, 111, '30 Spins', 59.00),
(52, 111, '80 Spins', 129.00),
(53, 111, '200 Spins', 299.00),
(54, 111, '400 Spins', 699.00),
(55, 111, '1,200 Spins', 1500.00),
(56, 112, '130 Coins', 29.00),
(57, 112, '550 Coins', 149.00),
(58, 112, '1,050 Coins', 299.00),
(59, 112, '2,150 Coins', 599.00),
(60, 112, '3,300 Coins', 899.00),
(61, 113, '100 FC Points', 35.00),
(62, 113, '520 FC Points', 179.00),
(63, 113, '1,070 FC Points', 349.00),
(64, 113, '2,200 FC Points', 729.00),
(65, 113, '5,750 FC Points', 1799.00),
(66, 114, '18 Nyan Berry', 29.00),
(67, 114, '95 Nyan Berry', 149.00),
(68, 114, '310 Nyan Berry', 449.00),
(69, 114, '650 Nyan Berry', 899.00),
(70, 114, '1,200 Nyan Berry', 1600.00),
(71, 115, '40 Pearls', 29.00),
(72, 115, '200 Pearls', 149.00),
(73, 115, '400 Pearls', 299.00),
(74, 115, '1,200 Pearls', 899.00),
(75, 115, '2,000 Pearls', 1499.00),
(76, 116, '72 Crystals', 99.00),
(77, 116, '300 Crystals', 349.00),
(78, 116, '750 Crystals', 899.00),
(79, 116, '1,350 Crystals', 1600.00),
(80, 116, '3,000 Crystals', 3200.00),
(81, 117, '80 Gems', 35.00),
(82, 117, '500 Gems', 179.00),
(83, 117, '1,200 Gems', 349.00),
(84, 117, '2,500 Gems', 699.00),
(85, 117, '6,500 Gems', 1750.00),
(86, 118, '250 RP', 75.00),
(87, 118, '1,350 RP', 300.00),
(88, 118, '2,800 RP', 600.00),
(89, 118, '5,000 RP', 1050.00),
(90, 118, '7,200 RP', 1500.00),
(91, 119, '80 RC', 29.00),
(92, 119, '250 RC', 89.00),
(93, 119, '450 RC', 149.00),
(94, 119, '880 RC', 299.00),
(95, 119, '1,800 RC', 599.00),
(96, 120, '145 TFT Coins', 29.00),
(97, 120, '720 TFT Coins', 149.00),
(98, 120, 'TFT Pass+', 299.00),
(99, 120, '1,450 TFT Coins', 300.00),
(100, 120, '2,950 TFT Coins', 600.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `in_game_uid` varchar(100) NOT NULL,
  `status` enum('success','failed') DEFAULT 'success',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `game_id`, `item_id`, `price`, `in_game_uid`, `status`, `created_at`) VALUES
(1, 2, 101, 2, 47.50, 'UID-888888', 'success', '2023-11-20 03:00:00'),
(2, 2, 103, 7, 119.00, 'UID-999999', 'success', '2023-11-21 08:30:00'),
(3, 2, 104, 11, 130.00, 'Riot#1234', 'success', '2023-11-22 02:15:00'),
(4, 1, 102, 6, 10.00, '462', 'success', '2025-11-30 05:40:55'),
(5, 1, 103, 14, 449.00, '214', 'success', '2025-11-30 05:41:10'),
(6, 3, 102, 6, 10.00, '1234', 'success', '2025-11-30 06:14:54'),
(7, 3, 101, 1, 9.50, '12', 'success', '2025-11-30 06:26:22'),
(8, 3, 102, 8, 90.00, '112', 'success', '2025-11-30 06:32:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `balance`, `role`) VALUES
(1, 'admin', '123456', '', 99640.00, 'admin'),
(2, 'student', '123456', '', 500.00, 'user'),
(3, 'tiger', '123456', 'tiger@gmail.com', 90.50, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('topup','purchase','refund') NOT NULL DEFAULT 'topup',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `user_id`, `amount`, `type`, `created_at`) VALUES
(1, 1, 50.00, 'topup', '2025-11-30 05:25:02'),
(2, 1, 50.00, 'topup', '2025-11-30 05:42:02'),
(3, 3, 50.00, 'topup', '2025-11-30 06:14:38'),
(4, 3, 50.00, 'topup', '2025-11-30 06:31:23'),
(5, 3, 100.00, 'topup', '2025-11-30 06:31:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_items`
--
ALTER TABLE `game_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `game_items`
--
ALTER TABLE `game_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
