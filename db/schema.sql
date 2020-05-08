/*             Borrowings
 *  Sets ___       |
 *          |___ Bridge ---- Parts
 *  MOCs ---/
 *
 * Run the following as root
 */

CREATE DATABASE brickcollector;
USE brickcollector;

/* Sets */
CREATE TABLE sets (
    id VARCHAR(64) NOT NULL,
    title VARCHAR(100),
    part_count INT,
    theme VARCHAR(64),
    img VARCHAR(200), /* Path to image file */
    quantity INT NOT NULL,
    PRIMARY KEY (id)
);

/* MOCS */
CREATE TABLE mocs (
    m_id VARCHAR(64) NOT NULL,
    title VARCHAR(200),
    part_count INT,
    created DATE,
    img VARCHAR(200),
    quantity INT NOT NULL,
    PRIMARY KEY (m_id)
);

/* PARTS */
CREATE TABLE parts (
    id VARCHAR(64) NOT NULL,
    title VARCHAR(100),
    color VARCHAR(100) NOT NULL,
    img VARCHAR(200),
    quantity INT NOT NULL,
    loose INT, /* Indicates how many are not part of a set or MOC via the bridge */
    PRIMARY KEY (id)
);

/* BRIDGE:
Handles many-to-many relationship of sets/MOCs and parts */
CREATE TABLE bridge (
    x_id VARCHAR(64) NOT NULL,
    p_id VARCHAR(64) NOT NULL,
    quantity INT NOT NULL,
    lending INT /* Indicates how many are being borrowed for a MOC */
);

/* BORROWINGS:
Handles situation where a part was borrowed from a set to a MOC */
CREATE TABLE borrowings (
    to_id VARCHAR(64) NOT NULL,   /* "For this MOC             */
    from_id VARCHAR(64) NOT NULL, /* we borrowed from this SET */
    p_id VARCHAR(64) NOT NULL,    /* this PART                 */
    quantity INT NOT NULL         /* in this QUANTITY."        */
);

/* App user used to connect */
CREATE USER 'bc_app'@'localhost' IDENTIFIED BY 'bc_pw';
GRANT ALL PRIVILEGES ON brickcollector.* TO 'bc_app'@'localhost';