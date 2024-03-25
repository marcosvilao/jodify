CREATE DATABASE jodifydb

CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    date_from DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    event_Type VARCHAR(255) NOT NULL,
    ticket_Link VARCHAR(500) NOT NULL,
    image_url VARCHAR(255),
    event_Djs VARCHAR(255)[] NOT NULL
);

CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    eventID SERIAL PRIMARY KEY

);

