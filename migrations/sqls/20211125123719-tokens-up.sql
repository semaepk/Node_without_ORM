/* Replace with your SQL commands */
-- Table: public.tokens

-- DROP TABLE public.tokens;

CREATE TABLE IF NOT EXISTS 
tokens(
    id SERIAL PRIMARY KEY,
    userId uuid,
    "refreshtoken" character varying(255) COLLATE pg_catalog."default",
    FOREIGN KEY (userId) REFERENCES users (uid)
)