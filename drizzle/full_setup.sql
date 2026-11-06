-- ============================================================================
-- Royal Chauffeur UAE - Complete Database Setup (Schema + Initial Seed)
-- For HosterPK / cPanel phpMyAdmin (1-Click Import)
-- Initial Admin Email: admin@royalchauffeuruae.com
-- Initial Password: Admin@Royal2026!  (PUBLICLY KNOWN - CHANGE IMMEDIATELY after first login/import)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- -------------------------------------------------------------
-- 1. Table: admins
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int AUTO_INCREMENT NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 2. Table: blog_categories
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 3. Table: blog_posts
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text,
  `content` longtext NOT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `author_name` varchar(100) DEFAULT 'Royal Chauffeur UAE',
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `read_time` varchar(50) DEFAULT '5 min read',
  `views_count` int NOT NULL DEFAULT 0,
  `key_takeaways` text,
  `faqs` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  KEY `blog_posts_category_id_fk` (`category_id`),
  KEY `blog_posts_author_id_fk` (`author_id`),
  CONSTRAINT `blog_posts_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blog_posts_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 4. Table: blog_tags
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_tags` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_tags_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 5. Table: blog_post_tags (Many-to-Many Join)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_post_tags` (
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  KEY `blog_post_tags_tag_id_fk` (`tag_id`),
  CONSTRAINT `blog_post_tags_post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blog_post_tags_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 6. Table: media_files
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media_files` (
  `id` int AUTO_INCREMENT NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_size` int NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `uploader_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `media_files_uploader_id_fk` (`uploader_id`),
  CONSTRAINT `media_files_uploader_id_fk` FOREIGN KEY (`uploader_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table: enquiries (website contact form submissions)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `service` varchar(120) DEFAULT NULL,
  `pickup_date` varchar(40) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `enquiries_status_idx` (`status`),
  KEY `enquiries_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- 1. Default Admin Account
INSERT INTO `admins` (`id`, `email`, `password_hash`, `name`, `role`, `created_at`, `updated_at`)
VALUES (
  1,
  'admin@royalchauffeuruae.com',
  '$2b$10$bhUvK5EkP4SB0/aTLNdqv.YC8dBpb.XmVbpwJknHnoI81Jc.vB3km',
  'Royal Administrator',
  'admin',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  `email` = `email`; -- never overwrite an existing admin password on re-import

-- 2. Blog Categories
INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`, `created_at`) VALUES
(1, 'Dubai Travel & Itineraries', 'dubai-travel-itineraries', 'Curated luxury itineraries, iconic sights, and insider recommendations across Dubai.', NOW()),
(2, 'Luxury Lifestyle & Fleet', 'luxury-lifestyle-fleet', 'Spotlights on premium vehicles, bespoke amenities, and the UAE VIP lifestyle.', NOW()),
(3, 'Corporate & Executive Travel', 'corporate-executive-travel', 'Professional chauffeur standards, roadshow logistics, and business executive transport.', NOW()),
(4, 'Airport Transfers & VIP Guides', 'airport-transfers-vip-guides', 'Stress-free airport pickups at DXB, DWC, and Abu Dhabi international terminals.', NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Sample Luxury Blog Posts
INSERT INTO `blog_posts` (
  `id`, `title`, `slug`, `excerpt`, `content`, `cover_image`,
  `category_id`, `author_id`, `author_name`, `status`, `featured`,
  `read_time`, `views_count`, `key_takeaways`, `faqs`,
  `meta_title`, `meta_description`, `meta_keywords`, `published_at`, `created_at`, `updated_at`
) VALUES
(
  1,
  'The Ultimate Guide to Dubai Airport Chauffeur Transfers (DXB & DWC)',
  'ultimate-guide-dubai-airport-chauffeur-transfers',
  'Navigating Dubai International Airport with seamless VIP baggage assistance, flight monitoring, and luxury door-to-door transfer in Mercedes S-Class or BMW 7 Series.',
  'Dubai International Airport (DXB) is one of the busiest travel hubs in the world. After a long flight, navigating baggage carousels, customs, and taxi queues can be overwhelming. Choosing a private chauffeur service ensures you transition effortlessly from the aircraft directly into the cool comfort of a climate-controlled luxury sedan.\n\n## Why Book an Airport Chauffeur in Dubai?\n\nUnlike standard metered taxis or on-demand rideshare apps where availability, surge pricing, and vehicle standards vary wildly, a pre-arranged chauffeur provides:\n\n- **Guaranteed Vehicle Tier**: Travel in an immaculate Mercedes S-Class, BMW 7 Series, Cadillac Escalade, or GMC Yukon Denali.\n- **Dedicated Flight Tracking**: Our operations desk tracks your flight in real time.\n- **Inside Terminal Meet & Greet**: Your smartly suited chauffeur greets you right outside the baggage exit holding a discreet digital or gold-embossed name badge.\n\n## Terminal Pickup Logistics at DXB Terminal 1 & 3\n\nWhen you touch down at DXB:\n1. Pass through Smart Gates or Immigration.\n2. Collect Checked Luggage.\n3. Your chauffeur assists with baggage and escorts you to the executive VIP parking bay.\n\n## Booking Your Chauffeur Journey\n\nWhether heading straight to DIFC or checking into your resort on Palm Jumeirah, Royal Chauffeur UAE operates 24/7 with fixed hourly and point-to-point rates.',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
  4,
  1,
  'Royal Chauffeur UAE',
  'published',
  1,
  '6 min read',
  142,
  '["Real-time flight radar tracking ensures zero waiting time regardless of arrival delays.","Meet & Greet service includes luggage escort from arrivals hall directly to the executive curb.","Fixed, transparent pricing with no surge fees during peak Dubai travel seasons.","Complimentary onboard high-speed Wi-Fi, refreshments, and tailored temperature control."]',
  '[{"question":"How does the chauffeur track my flight arriving at DXB?","answer":"We monitor flight numbers in real-time. Even if your flight is early or delayed by several hours, your chauffeur adjusts automatically and waits in the arrivals terminal with a personalized name board."},{"question":"Is waiting time complimentary for airport pickups?","answer":"Yes, all international airport pickups include 60 minutes of complimentary waiting time after flight touchdown to allow ample time for immigration and baggage retrieval."}]',
  'Dubai Airport Chauffeur Transfer (DXB & DWC) Guide | Royal Chauffeur UAE',
  'Experience stress-free VIP airport transfers at Dubai Airport. Discover our flight tracking, meet & greet baggage assistance, and executive fleet.',
  'dubai airport transfer, dxb chauffeur, executive airport pickup',
  NOW(),
  NOW(),
  NOW()
),
(
  2,
  'Top 7 Reasons Why Business Executives Choose Chauffeur Services in Dubai',
  'reasons-executives-choose-chauffeur-services-dubai',
  'From DIFC board meetings to Abu Dhabi state visits, discover why corporate leaders rely on dedicated chauffeurs for productivity, punctuality, and prestige.',
  'In Dubai fast-paced corporate landscape, time is the ultimate luxury. Managing heavy traffic on Sheikh Zayed Road or hunting for valet parking at conference venues wastes valuable minutes that could be spent preparing for board presentations or closing deals.\n\n## The Executive Mobile Office\n\nModern luxury sedans like the Mercedes-Benz S-Class and BMW 7-Series are engineered with executive rear-seat ergonomics:\n- Reclining executive seating with massage functionality.\n- Acoustic glass insulation dampening road noise for pristine conference calls.\n- High-speed onboard 5G connectivity and device charging.\n\n## Roadshows and Multi-Stop Itineraries\n\nWith our daily and hourly standby packages, your chauffeur remains parked on-site, ready to roll the moment you step out of the lobby.',
  'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=80',
  3,
  1,
  'Royal Chauffeur UAE',
  'published',
  0,
  '5 min read',
  98,
  '["Transform transit time into an undisturbed mobile office with privacy partitions and Wi-Fi.","Eliminate parking hassles and navigation stress in high-density districts like Downtown and DIFC.","Present an impeccably polished image for high-stakes investor meetings and VIP clients."]',
  '[{"question":"Can business clients arrange monthly corporate accounts?","answer":"Yes, Royal Chauffeur UAE provides streamlined corporate billing with consolidated monthly VAT invoicing and priority vehicle allocation."}]',
  'Corporate Chauffeur Service Dubai | Executive Transport | Royal Chauffeur',
  'Discover how executive chauffeur services optimize corporate roadshows, DIFC meetings, and VIP delegations across Dubai and Abu Dhabi.',
  'corporate chauffeur dubai, executive transport uae, difc business driver',
  NOW(),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

SET FOREIGN_KEY_CHECKS = 1;

