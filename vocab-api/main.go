package main

import (
	"context"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"github.com/Ryohskay/vocab_mgr/vocab-api/dbaccess"
)

func main() {
	router := gin.Default()
	db, ctx := dbaccess.DbConnInit()
	router.GET("api/languages", listLangs(db, ctx))
	router.Run()
}

func listLangs(db *gorm.DB, ctx context.Context) gin.HandlerFunc {
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
