package main

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

func initDB() *sql.DB {
	db, err := sql.Open("sqlite", "./data/vocab.db")
	if err != nil {
		log.Fatal(err)
	}

	createTables := `
	CREATE TABLE IF NOT EXISTS languages (
		code TEXT PRIMARY KEY,
		script TEXT NOT NULL,
		endonym TEXT NOT NULL,
		exonym_en TEXT NOT NULL,
		language_family TEXT,
		area_spoken TEXT
	);

	CREATE TABLE IF NOT EXISTS vocabulary (
		word_id INTEGER PRIMARY KEY AUTOINCREMENT,
		lemma TEXT NOT NULL,
		language TEXT NOT NULL,
		part_of_speech TEXT NOT NULL,
		transliteration TEXT,
		definition TEXT NOT NULL,
		synonyms TEXT,
		tags TEXT,
		etymology_notes TEXT,
		origin_language TEXT,
		notes TEXT,
		FOREIGN KEY (language) REFERENCES languages(code)
	);`

	_, err = db.Exec(createTables)
	if err != nil {
		log.Fatal(err)
	}

	return db
}
