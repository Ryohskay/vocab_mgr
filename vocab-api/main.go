package main

import (
	"github.com/gin-gonic/gin"
	"github.com/Ryohskay/vocab_mgr/vocab-api/dbaccess"
)

func main() {
	router := gin.Default()
	db, ctx := dbaccess.DbConnInit()
	router.GET("api/languages", ListLangs(db, ctx))
	// define path param `lang_id` (accessible via c.Param())
	router.GET("api/:lang_id/vocabulary", ListVocabs())
	router.Run()
}
