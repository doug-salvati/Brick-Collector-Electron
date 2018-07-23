/*             Borrowings
 *  Sets ___       |
 *          |___ Bridge ---- Parts
 *  MOCs ---/
 *
 * Run the following as root
 */

CREATE DATABASE brickcollectordev;
USE brickcollectordev;

/* Sets */
CREATE TABLE sets (
    s_id VARCHAR(25) NOT NULL,
    title VARCHAR(100),
    part_count INT,
    theme INT,
    img VARCHAR(200), /* Path to image file */
    quantity INT NOT NULL,
    PRIMARY KEY (s_id)
);

/* MOCS */
CREATE TABLE mocs (
    m_id VARCHAR(25) NOT NULL,
    title VARCHAR(100),
    part_count INT,
    created DATE,
    img VARCHAR(200),
    quantity INT NOT NULL,
    PRIMARY KEY (m_id)
);

/* PARTS */
CREATE TABLE parts (
    p_id VARCHAR(25) NOT NULL,
    title VARCHAR(100),
    color VARCHAR(100) NOT NULL,
    img VARCHAR(200),
    quantity INT NOT NULL,
    loose INT, /* Indicates how many are not part of a set or MOC via the bridge */
    PRIMARY KEY (p_id)
);

/* BRIDGE:
Handles many-to-many relationship of sets/MOCs and parts */
CREATE TABLE bridge (
    x_id VARCHAR(25) NOT NULL,
    p_id VARCHAR(25) NOT NULL,
    quantity INT NOT NULL,
    lending INT /* Indicates how many are being borrowed for a MOC */
);

/* BORROWINGS:
Handles situation where a part was borrowed from a set to a MOC */
CREATE TABLE borrowings (
    to_id VARCHAR(25) NOT NULL,   /* "For this MOC             */
    from_id VARCHAR(25) NOT NULL, /* we borrowed from this SET */
    p_id VARCHAR(25) NOT NULL,    /* this PART                 */
    quantity INT NOT NULL         /* in this QUANTITY."        */
);

/* App user used to connect */
CREATE USER 'bc_app'@'localhost' IDENTIFIED BY 'bc_pw';
GRANT ALL PRIVILEGES ON brickcollectordev.* TO 'bc_app'@'localhost';