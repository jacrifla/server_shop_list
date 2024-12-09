-- Active: 1724707473420@@127.0.0.1@3306@buylist
--CREATE DATABASE  buylist;
--use buylist;

CREATE TABLE users (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiration DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE shopping_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
ALTER TABLE shopping_lists ADD CONSTRAINT fk_shopping_lists_users FOREIGN KEY (user_id) REFERENCES users(id);


CREATE TABLE list_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
ALTER TABLE list_items ADD CONSTRAINT fk_list_items_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id);


CREATE Table share_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES shopping_lists(id)
);
ALTER TABLE share_tokens ADD CONSTRAINT fk_share_tokens_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id);


CREATE Table direct_shares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    shared_with_user_id INT NOT NULL,
    permission ENUM('view', 'edit') DEFAULT 'view',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE direct_shares ADD CONSTRAINT fk_direct_shares_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id);
ALTER TABLE direct_shares ADD CONSTRAINT fk_direct_shares_users FOREIGN KEY (shared_with_user_id) REFERENCES users(id);


SELECT * from shopping_lists Where user_id = 1