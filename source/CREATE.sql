CREATE TABLE users (
    user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    provider VARCHAR(64),
    social_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    social_page VARCHAR(1024),
    gender VARCHAR(10),
    birthday DATE,
    avatar VARCHAR(2048),
	last_login_time DATETIME,
	password VARCHAR(1024)
);

CREATE TABLE diagrams (
	diagram_id INTEGER PRIMARY KEY,
	author_id INTEGER,
	diagram_name VARCHAR(255),
	diagram_type VARCHAR(20),
	create_date DATE,
	FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE mains (
	main_id INTEGER PRIMARY KEY,
	name VARCHAR(255),
	position VARCHAR(255),
	diagram_id INTEGER,
	FOREIGN KEY (diagram_id) REFERENCES diagrams(diagram_id)
);

CREATE TABLE attributes (
	attribute_id INTEGER PRIMARY KEY,
	parent_id INTEGER NOT NULL,
	name VARCHAR(255),
	position VARCHAR(255),
	data_type VARCHAR(10),
	data_len INTEGER,
	key VARCHAR(2),
	diagram_id INTEGER,
	FOREIGN KEY (diagram_id) REFERENCES diagrams(diagram_id)
);

CREATE TABLE relationships (
	relationship_id INTEGER PRIMARY KEY,
	first_main INTEGER NOT NULL,
	second_main INTEGER NOT NULL,
	rel_type VARCHAR(20),
    rel_identity BOOLEAN,
	rel_description VARCHAR(255),
	position VARCHAR(255),
	diagram_id INTEGER,
	FOREIGN KEY (diagram_id) REFERENCES diagrams(diagram_id)
);


CREATE TABLE links (
	link_id INTEGER PRIMARY KEY,
	parent_id INTEGER NOT NULL,
	position VARCHAR(255),
	position_num INTEGER,
	diagram_id INTEGER,
	FOREIGN KEY (diagram_id) REFERENCES diagrams(diagram_id)
)