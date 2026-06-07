PRAGMA foreign_keys = OFF;

DROP TRIGGER IF EXISTS trg_users_updated_at;
DROP TRIGGER IF EXISTS trg_trade_posts_updated_at;
DROP TRIGGER IF EXISTS trg_trade_requests_updated_at;

DROP TABLE IF EXISTS trade_requests;
DROP TABLE IF EXISTS trade_available_time;
DROP TABLE IF EXISTS book_images;
DROP TABLE IF EXISTS trade_posts;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS location_presets;
DROP TABLE IF EXISTS users;

PRAGMA foreign_keys = ON;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    radius INTEGER,
    CONSTRAINT chk_users_latitude CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_users_longitude CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    CONSTRAINT chk_users_radius CHECK (radius IS NULL OR radius >= 0)
);

CREATE TABLE location_presets (
    location_id VARCHAR(30) PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    radius_label VARCHAR(30) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0)
);

CREATE TABLE categories (
    category_code CHAR(6) PRIMARY KEY,
    parent_code CHAR(6),
    type VARCHAR(10) NOT NULL CHECK (type IN ('MAJOR', 'COURSE')),
    name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_code)
        REFERENCES categories (category_code)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100),
    publisher VARCHAR(100),
    edition VARCHAR(50),
    isbn VARCHAR(30) UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trade_posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    category_code CHAR(6) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD')),
    place_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    radius INTEGER NOT NULL CHECK (radius >= 0),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    CONSTRAINT fk_trade_posts_seller
        FOREIGN KEY (seller_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_trade_posts_book
        FOREIGN KEY (book_id)
        REFERENCES books (book_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_trade_posts_category
        FOREIGN KEY (category_code)
        REFERENCES categories (category_code)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE book_images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_images_post
        FOREIGN KEY (post_id)
        REFERENCES trade_posts (post_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uk_book_images_post_sort UNIQUE (post_id, sort_order)
);

CREATE TABLE trade_available_time (
    available_time_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    CONSTRAINT fk_trade_available_time_post
        FOREIGN KEY (post_id)
        REFERENCES trade_posts (post_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_trade_available_time_range CHECK (start_at < end_at)
);

CREATE TABLE trade_requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    available_time_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REJECTED', 'ACCEPTED')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trade_requests_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_trade_requests_post
        FOREIGN KEY (post_id)
        REFERENCES trade_posts (post_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_trade_requests_available_time
        FOREIGN KEY (available_time_id)
        REFERENCES trade_available_time (available_time_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uk_trade_requests_user_post UNIQUE (user_id, post_id)
);

CREATE INDEX idx_categories_parent_code ON categories (parent_code);
CREATE INDEX idx_location_presets_sort_order ON location_presets (sort_order);
CREATE INDEX idx_trade_posts_seller ON trade_posts (seller_id);
CREATE INDEX idx_trade_posts_book ON trade_posts (book_id);
CREATE INDEX idx_trade_posts_category_status ON trade_posts (category_code, status);
CREATE INDEX idx_trade_posts_status_location ON trade_posts (status, latitude, longitude);
CREATE INDEX idx_trade_posts_created_at ON trade_posts (created_at);
CREATE INDEX idx_book_images_post_id ON book_images (post_id);
CREATE INDEX idx_trade_available_time_post_id ON trade_available_time (post_id);
CREATE INDEX idx_trade_requests_user_id ON trade_requests (user_id);
CREATE INDEX idx_trade_requests_post_id ON trade_requests (post_id);
CREATE INDEX idx_trade_requests_status ON trade_requests (status);

CREATE TRIGGER trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = NEW.user_id;
END;

CREATE TRIGGER trg_trade_posts_updated_at
AFTER UPDATE ON trade_posts
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE trade_posts SET updated_at = CURRENT_TIMESTAMP WHERE post_id = NEW.post_id;
END;

CREATE TRIGGER trg_trade_requests_updated_at
AFTER UPDATE ON trade_requests
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE trade_requests SET updated_at = CURRENT_TIMESTAMP WHERE request_id = NEW.request_id;
END;
