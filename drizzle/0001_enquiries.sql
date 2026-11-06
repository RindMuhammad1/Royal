-- ============================================================================
-- Royal Chauffeur UAE - Migration 0001: contact form enquiries
-- Can be run directly in phpMyAdmin (SQL tab) on an existing database.
-- ============================================================================

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
