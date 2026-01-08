package main

import (
	"context"
	"strconv"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"github.com/Ryohskay/vocab_mgr/vocab-api/dbaccess"
)

// List languages
func ListLangs(db *gorm.DB, ctx context.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
	
		langs, err := dbaccess.GetLangs(db, ctx)
		if err == nil {
			c.JSON(200, langs)
		} else {
			c.JSON(500, gin.H{
				"message": "Failed to get languages from the DB",
			})
		}
	}
}

// List vocabs of a particular language
func ListVocabs(db *gorm.DB, ctx context.Context) gin.HandlerFunc {
	return func (c *gin.Context) {
		// get the path parameter
		lang_id, p_err := strconv.Atoi(c.Param("lang_id"))
		if p_err == nil {
			findVocabsByLang(uint(lang_id), db, ctx, c)
		} else {
			c.JSON(400, gin.H{
				"message": "Request with a non-int value as the language id",
			})
		}
	}
}


func findVocabsByLang(lang_id uint, db *gorm.DB, ctx context.Context, gin_ctx *gin.Context) {
	vocabs, err := dbaccess.GetVocabsByLang(lang_id, db, ctx)
	if err == nil {
		gin_ctx.JSON(200, gin.H{
			"language": lang_id,
			"vocabularies": vocabs,
		})
	} else {
		gin_ctx.JSON(500, gin.H{
			"message": "Failed to get vocabs from the DB",
		})
	}
}
