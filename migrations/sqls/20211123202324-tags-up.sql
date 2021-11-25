/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS
    tags(
        id SERIAL PRIMARY KEY,
        creator UUID,
        name VARCHAR(40) NOT NULL,
        sortOrder numeric DEFAULT 0,
        FOREIGN KEY (creator) REFERENCES users (uid)
    )