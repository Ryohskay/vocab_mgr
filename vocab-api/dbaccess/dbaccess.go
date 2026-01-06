package dbaccess

import (
	"log"
	"fmt"
	"context"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Language struct {
	gorm.Model
	iso string
	script string
	endonym string
	exonym_en string
	stage *string
	language_family *string
	area_used string
}

func GetLangs() {
	db, err := gorm.Open(sqlite.Open("../data/database.db"), &gorm.Config{})
	if err != nil {
		log.Fatalln("Failed to connect!", err)
	}
	ctx := context.Background()

	db.AutoMigrate(&Language{})

	lang := Language{iso: "xba", script: "Bhks", endonym: "Mattam bhasa", exonym_en: "Martabanese", area_used: "Southeast Asia"}

	err = gorm.G[Language](db).Create(ctx, &lang)

	langs, err := gorm.G[Language](db).Find(ctx)
	for _, lang := range langs {
		fmt.Println(lang.iso, lang.endonym, lang.exonym_en)
	}

}
