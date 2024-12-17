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
ALTER TABLE shopping_lists ADD CONSTRAINT fk_shopping_lists_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


CREATE TABLE list_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    observation TEXT,
    checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
ALTER TABLE list_items
ADD CONSTRAINT fk_list_items_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE;


CREATE Table share_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
ALTER TABLE share_tokens ADD CONSTRAINT fk_share_tokens_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE;

ALTER TABLE share_tokens ADD CONSTRAINT fk_share_tokens_user FOREIGN KEY (user_id) REFERENCES users(id);

CREATE TABLE shared_list_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    user_id INT NOT NULL,
    can_edit BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE shared_list_permissions ADD CONSTRAINT shared_list_permissions_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE;

ALTER TABLE shared_list_permissions ADD CONSTRAINT shared_list_permissions_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE Table direct_shares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    shared_with_user_id INT NOT NULL,
    permission ENUM('view', 'edit') DEFAULT 'view',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE direct_shares ADD CONSTRAINT fk_direct_shares_shopping_lists FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE;
ALTER TABLE direct_shares ADD CONSTRAINT fk_direct_shares_users FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE;


SELECT * from shopping_lists Where user_id = 3;
SELECT * FROM shared_list_permissions where list_id = 2 and user_id = 4;
SELECT can_edit FROM shared_list_permissions WHERE list_id = 2 AND user_id = 4;

SELECT * FROM users;
SELECT * FROM list_items WHERE list_id = 2;
SELECT * FROM share_tokens where token =  'b75a0141-b757-11ef-9152-d09466e2bf67';
SELECT a.* 
FROM shopping_lists a
WHERE a.user_id = 2 
UNION
SELECT a.* 
FROM shopping_lists a
JOIN shared_list_permissions b 
ON a.id = b.list_id 
WHERE b.user_id = 2;

-- Drop FK
-- ALTER TABLE share_tokens DROP FOREIGN KEY fk_share_tokens_shopping_lists;