package main

type Language struct {
	Code           string `json:"code" binding:"required"`
	Script         string `json:"script" binding:"required"`
	Endonym        string `json:"endonym" binding:"required"`
	ExonymEn       string `json:"exonym_en" binding:"required"`
	LanguageFamily string `json:"language_family"`
	AreaSpoken     string `json:"area_spoken"`
}

type Vocabulary struct {
	WordID         int    `json:"word_id"`
	Lemma          string `json:"lemma" binding:"required"`
	Language       string `json:"language" binding:"required"`
	PartOfSpeech   string `json:"part_of_speech" binding:"required"`
	Transliteration string `json:"transliteration"`
	Definition     string `json:"definition" binding:"required"`
	Synonyms       string `json:"synonyms"`
	Tags           string `json:"tags"`
	EtymologyNotes string `json:"etymology_notes"`
	OriginLanguage string `json:"origin_language"`
	Notes          string `json:"notes"`
}
