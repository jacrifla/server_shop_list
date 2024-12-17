CREATE Table users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE shopping_lists (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    Foreign Key (user_id) REFERENCES users (id)
);

CREATE TABLE list_items(
    id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    Foreign Key (list_id) REFERENCES shopping_lists(id)
);

CREATE Table share_tokens (
    id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (list_id) REFERENCES shopping_lists(id)
);

CREATE Table share_tokens (
    id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    shared_with_user_id INT NOT NULL,
    permissions VARCHAR(10) CHECK (permissions IN ('view', 'edit')) DEFAULT 'view',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (list_id) REFERENCES shopping_lists(id),
    Foreign Key (shared_with_user_id) REFERENCES users(id)
);