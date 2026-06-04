SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `trade_requests`;
DROP TABLE IF EXISTS `trade_available_time`;
DROP TABLE IF EXISTS `book_images`;
DROP TABLE IF EXISTS `trade_posts`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(50) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `latitude` DECIMAL(10,7) NULL COMMENT 'user center latitude',
    `longitude` DECIMAL(10,7) NULL COMMENT 'user center longitude',
    `radius` INT NULL COMMENT 'user search radius in meters',
    CONSTRAINT `PK_USERS` PRIMARY KEY (`user_id`),
    CONSTRAINT `UK_USERS_EMAIL` UNIQUE (`email`),
    CONSTRAINT `CHK_USERS_LATITUDE`
        CHECK (`latitude` IS NULL OR (`latitude` BETWEEN -90 AND 90)),
    CONSTRAINT `CHK_USERS_LONGITUDE`
        CHECK (`longitude` IS NULL OR (`longitude` BETWEEN -180 AND 180)),
    CONSTRAINT `CHK_USERS_RADIUS`
        CHECK (`radius` IS NULL OR `radius` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
    `category_code` CHAR(6) NOT NULL,
    `parent_code` CHAR(6) NULL COMMENT 'major code is parent code',
    `type` ENUM('MAJOR', 'COURSE') NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    CONSTRAINT `PK_CATEGORIES` PRIMARY KEY (`category_code`),
    CONSTRAINT `FK_CATEGORIES_PARENT`
        FOREIGN KEY (`parent_code`)
        REFERENCES `categories` (`category_code`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `books` (
    `book_id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `author` VARCHAR(100) NULL,
    `publisher` VARCHAR(100) NULL,
    `edition` VARCHAR(50) NULL,
    `isbn` VARCHAR(30) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `PK_BOOKS` PRIMARY KEY (`book_id`),
    CONSTRAINT `UK_BOOKS_ISBN` UNIQUE (`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `trade_posts` (
    `post_id` BIGINT NOT NULL AUTO_INCREMENT,
    `seller_id` BIGINT NOT NULL,
    `book_id` BIGINT NOT NULL,
    `category_code` CHAR(6) NOT NULL,
    `price` INT NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('AVAILABLE', 'RESERVED', 'SOLD') NOT NULL DEFAULT 'AVAILABLE',
    `place_name` VARCHAR(255) NOT NULL COMMENT 'preferred trade place name',
    `latitude` DECIMAL(10,7) NOT NULL COMMENT 'trade place latitude',
    `longitude` DECIMAL(10,7) NOT NULL COMMENT 'trade place longitude',
    `radius` INT NOT NULL COMMENT 'seller trade radius in meters',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    CONSTRAINT `PK_TRADE_POSTS` PRIMARY KEY (`post_id`),
    CONSTRAINT `FK_TRADE_POSTS_SELLER`
        FOREIGN KEY (`seller_id`)
        REFERENCES `users` (`user_id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `FK_TRADE_POSTS_BOOK`
        FOREIGN KEY (`book_id`)
        REFERENCES `books` (`book_id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `FK_TRADE_POSTS_CATEGORY`
        FOREIGN KEY (`category_code`)
        REFERENCES `categories` (`category_code`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `CHK_TRADE_POSTS_PRICE`
        CHECK (`price` >= 0),
    CONSTRAINT `CHK_TRADE_POSTS_LATITUDE`
        CHECK (`latitude` BETWEEN -90 AND 90),
    CONSTRAINT `CHK_TRADE_POSTS_LONGITUDE`
        CHECK (`longitude` BETWEEN -180 AND 180),
    CONSTRAINT `CHK_TRADE_POSTS_RADIUS`
        CHECK (`radius` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `book_images` (
    `image_id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '0 means primary image',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `PK_BOOK_IMAGES` PRIMARY KEY (`image_id`),
    CONSTRAINT `FK_BOOK_IMAGES_POST`
        FOREIGN KEY (`post_id`)
        REFERENCES `trade_posts` (`post_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `UK_BOOK_IMAGES_POST_SORT`
        UNIQUE (`post_id`, `sort_order`),
    CONSTRAINT `CHK_BOOK_IMAGES_SORT_ORDER`
        CHECK (`sort_order` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `trade_available_time` (
    `available_time_id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL,
    `start_at` DATETIME NOT NULL,
    `end_at` DATETIME NOT NULL,
    CONSTRAINT `PK_TRADE_AVAILABLE_TIME` PRIMARY KEY (`available_time_id`),
    CONSTRAINT `FK_TRADE_AVAILABLE_TIME_POST`
        FOREIGN KEY (`post_id`)
        REFERENCES `trade_posts` (`post_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `CHK_TRADE_AVAILABLE_TIME_RANGE`
        CHECK (`start_at` < `end_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `trade_requests` (
    `request_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT 'buyer id',
    `post_id` BIGINT NOT NULL COMMENT 'trade post id',
    `available_time_id` BIGINT NOT NULL COMMENT 'selected available time id',
    `status` ENUM('PENDING', 'REJECTED', 'ACCEPTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `PK_TRADE_REQUESTS` PRIMARY KEY (`request_id`),
    CONSTRAINT `FK_TRADE_REQUESTS_USER`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`user_id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `FK_TRADE_REQUESTS_POST`
        FOREIGN KEY (`post_id`)
        REFERENCES `trade_posts` (`post_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `FK_TRADE_REQUESTS_AVAILABLE_TIME`
        FOREIGN KEY (`available_time_id`)
        REFERENCES `trade_available_time` (`available_time_id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `UK_TRADE_REQUESTS_USER_POST`
        UNIQUE (`user_id`, `post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `IDX_CATEGORIES_PARENT_CODE`
ON `categories` (`parent_code`);

CREATE INDEX `IDX_TRADE_POSTS_SELLER`
ON `trade_posts` (`seller_id`);

CREATE INDEX `IDX_TRADE_POSTS_BOOK`
ON `trade_posts` (`book_id`);

CREATE INDEX `IDX_TRADE_POSTS_CATEGORY_STATUS`
ON `trade_posts` (`category_code`, `status`);

CREATE INDEX `IDX_TRADE_POSTS_STATUS_LOCATION`
ON `trade_posts` (`status`, `latitude`, `longitude`);

CREATE INDEX `IDX_TRADE_POSTS_CREATED_AT`
ON `trade_posts` (`created_at`);

CREATE INDEX `IDX_BOOK_IMAGES_POST_ID`
ON `book_images` (`post_id`);

CREATE INDEX `IDX_TRADE_AVAILABLE_TIME_POST_ID`
ON `trade_available_time` (`post_id`);

CREATE INDEX `IDX_TRADE_REQUESTS_USER_ID`
ON `trade_requests` (`user_id`);

CREATE INDEX `IDX_TRADE_REQUESTS_POST_ID`
ON `trade_requests` (`post_id`);

CREATE INDEX `IDX_TRADE_REQUESTS_STATUS`
ON `trade_requests` (`status`);
