package main

import (
	"github.com/gin-gonic/gin"
	"github.com/Ryohskay/vocab_mgr/vocab-api/dbaccess"
)

func main() {
	router := gin.Default()
	router.GET("api/languages", listLangs)
	router.Run()
}

func listLangs(c *gin.Context) {
	
	langs, err := dbaccess.GetLangs()
	if err == nil {
		c.JSON(200, langs)
	} else {
		c.JSON(500, gin.H{
			"message": "Failed to get languages from the DB",
		})
	}
}
