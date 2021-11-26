/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS
    users(
        uid uuid,
        email VARCHAR(128) UNIQUE,
        password VARCHAR(128),
        nickname VARCHAR(30) UNIQUE,
        PRIMARY KEY (uid)
    )