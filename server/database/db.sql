CREATE DATABASE jodifydb

CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    event_Title VARCHAR(255) NOT NULL UNIQUE,
    event_Date DATE NOT NULL,
    event_Location VARCHAR(255) NOT NULL,
    event_Type VARCHAR(255) NOT NULL,
    ticket_Link VARCHAR(500) NOT NULL,
    event_Image VARCHAR(255),
    event_Djs VARCHAR(255)[] NOT NULL
);

