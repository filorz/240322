CREATE TABLE users (
                       id SERIAL NOT NULL,
                       name varchar(40) NOT NULL,
                       username varchar(15) NOT NULL,
                       email varchar(40) NOT NULL,
                       password varchar(100) NOT NULL,
                       created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                       updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
                       UNIQUE(username),
                       UNIQUE(email),
                       PRIMARY KEY (id)
);

CREATE TABLE roles (
                       id SERIAL PRIMARY KEY,
                       name varchar(60) NOT NULL,
                       UNIQUE(name)
);

CREATE TABLE user_roles (
                            user_id bigint NOT NULL,
                            role_id bigint NOT NULL,
                            FOREIGN KEY (role_id) REFERENCES roles (id),
                            FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE category (
                       id SERIAL NOT NULL,
                       name varchar(40) NOT NULL,
                       description varchar(40) NOT NULL,
                       UNIQUE(name),
                       PRIMARY KEY (id)
);

CREATE TABLE product (
                       id SERIAL NOT NULL,
                       name varchar(40) NOT NULL,
                       description varchar(120) NOT NULL,
                       price bigint NOT NULL,
                       category_id bigint NOT NULL,
                       PRIMARY KEY (id),
                       UNIQUE(name)
);