-- ============================================================================
-- Royal Chauffeur UAE - Migration 0000
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB & phpMyAdmin
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'admin',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `blog_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	UNIQUE KEY `blog_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` longtext NOT NULL,
	`cover_image` varchar(500),
	`category_id` int,
	`author_id` int,
	`author_name` varchar(100) DEFAULT 'Royal Chauffeur UAE',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`featured` tinyint(1) NOT NULL DEFAULT 0,
	`read_time` varchar(50) DEFAULT '5 min read',
	`views_count` int NOT NULL DEFAULT 0,
	`key_takeaways` text,
	`faqs` json,
	`meta_title` varchar(255),
	`meta_description` text,
	`meta_keywords` varchar(255),
	`published_at` timestamp NULL DEFAULT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	UNIQUE KEY `blog_posts_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `blog_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	PRIMARY KEY(`id`),
	UNIQUE KEY `blog_tags_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `blog_post_tags` (
	`post_id` int NOT NULL,
	`tag_id` int NOT NULL,
	PRIMARY KEY(`post_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `media_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`original_name` varchar(255) NOT NULL,
	`file_path` varchar(500) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`file_size` int NOT NULL,
	`alt_text` varchar(255),
	`uploader_id` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `blog_post_tags` ADD CONSTRAINT `blog_post_tags_post_id_blog_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON DELETE CASCADE;
ALTER TABLE `blog_post_tags` ADD CONSTRAINT `blog_post_tags_tag_id_blog_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags`(`id`) ON DELETE CASCADE;
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_category_id_blog_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE SET NULL;
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_author_id_admins_id_fk` FOREIGN KEY (`author_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL;
ALTER TABLE `media_files` ADD CONSTRAINT `media_files_uploader_id_admins_id_fk` FOREIGN KEY (`uploader_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL;

SET FOREIGN_KEY_CHECKS = 1;
