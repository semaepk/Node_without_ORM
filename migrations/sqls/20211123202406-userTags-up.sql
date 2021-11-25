/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS
    usertags(
        id SERIAL PRIMARY KEY,
        tagId INTEGER NOT NULL,
        comment VARCHAR(255) NOT NULL,
        FOREIGN KEY (tagId) REFERENCES tags (id) ON DELETE CASCADE
    )