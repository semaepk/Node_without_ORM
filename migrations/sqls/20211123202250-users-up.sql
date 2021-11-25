/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS
    users(
        uid uuid DEFAULT uuid_generate_v4 (),
        email VARCHAR(128) UNIQUE,
        password VARCHAR(128),
        nickname VARCHAR(30) UNIQUE,
        PRIMARY KEY (uid)
    )