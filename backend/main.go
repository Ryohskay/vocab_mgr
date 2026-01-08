package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	db := initDB()
	defer db.Close()

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		// Languages
		api.GET("/languages", getLanguages(db))
		api.POST("/languages", createLanguage(db))
		api.PUT("/languages/:code", updateLanguage(db))
		api.DELETE("/languages/:code", deleteLanguage(db))

		// Vocabulary
		api.GET("/vocabulary", getVocabulary(db))
		api.POST("/vocabulary", createVocabulary(db))
		api.PUT("/vocabulary/:id", updateVocabulary(db))
		api.DELETE("/vocabulary/:id", deleteVocabulary(db))
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")
}

func getLanguages(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT code, script, endonym, exonym_en, language_family, area_spoken FROM languages")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var languages []Language
		for rows.Next() {
			var l Language
			if err := rows.Scan(&l.Code, &l.Script, &l.Endonym, &l.ExonymEn, &l.LanguageFamily, &l.AreaSpoken); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			languages = append(languages, l)
		}
		c.JSON(http.StatusOK, languages)
	}
}

func createLanguage(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var l Language
		if err := c.ShouldBindJSON(&l); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		_, err := db.Exec("INSERT INTO languages (code, script, endonym, exonym_en, language_family, area_spoken) VALUES (?, ?, ?, ?, ?, ?)",
			l.Code, l.Script, l.Endonym, l.ExonymEn, l.LanguageFamily, l.AreaSpoken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, l)
	}
}

func updateLanguage(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Param("code")
		var l Language
		if err := c.ShouldBindJSON(&l); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		_, err := db.Exec("UPDATE languages SET script=?, endonym=?, exonym_en=?, language_family=?, area_spoken=? WHERE code=?",
			l.Script, l.Endonym, l.ExonymEn, l.LanguageFamily, l.AreaSpoken, code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, l)
	}
}

func deleteLanguage(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Param("code")
		_, err := db.Exec("DELETE FROM languages WHERE code=?", code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Language deleted"})
	}
}

func getVocabulary(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		lang := c.Query("language")
		search := c.Query("search")
		query := "SELECT word_id, lemma, language, part_of_speech, transliteration, definition, synonyms, tags, etymology_notes, origin_language, notes FROM vocabulary WHERE 1=1"
		var args []interface{}

		if lang != "" {
			query += " AND language = ?"
			args = append(args, lang)
		}
		if search != "" {
			query += " AND (lemma LIKE ? OR transliteration LIKE ? OR definition LIKE ? OR origin_language LIKE ? OR tags LIKE ?)"
			term := "%" + search + "%"
			args = append(args, term, term, term, term, term)
		}

		rows, err := db.Query(query, args...)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var vocabulary []Vocabulary
		for rows.Next() {
			var v Vocabulary
			if err := rows.Scan(&v.WordID, &v.Lemma, &v.Language, &v.PartOfSpeech, &v.Transliteration, &v.Definition, &v.Synonyms, &v.Tags, &v.EtymologyNotes, &v.OriginLanguage, &v.Notes); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			vocabulary = append(vocabulary, v)
		}
		c.JSON(http.StatusOK, vocabulary)
	}
}

func createVocabulary(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var v Vocabulary
		if err := c.ShouldBindJSON(&v); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		res, err := db.Exec("INSERT INTO vocabulary (lemma, language, part_of_speech, transliteration, definition, synonyms, tags, etymology_notes, origin_language, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			v.Lemma, v.Language, v.PartOfSpeech, v.Transliteration, v.Definition, v.Synonyms, v.Tags, v.EtymologyNotes, v.OriginLanguage, v.Notes)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		id, _ := res.LastInsertId()
		v.WordID = int(id)
		c.JSON(http.StatusCreated, v)
	}
}

func updateVocabulary(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var v Vocabulary
		if err := c.ShouldBindJSON(&v); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		_, err := db.Exec("UPDATE vocabulary SET lemma=?, language=?, part_of_speech=?, transliteration=?, definition=?, synonyms=?, tags=?, etymology_notes=?, origin_language=?, notes=? WHERE word_id=?",
			v.Lemma, v.Language, v.PartOfSpeech, v.Transliteration, v.Definition, v.Synonyms, v.Tags, v.EtymologyNotes, v.OriginLanguage, v.Notes, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, v)
	}
}

func deleteVocabulary(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		_, err := db.Exec("DELETE FROM vocabulary WHERE word_id=?", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Vocabulary entry deleted"})
	}
}
