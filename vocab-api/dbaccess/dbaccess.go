package dbaccess

import (
	"log"
	"context"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Language struct {
	gorm.Model
	ISO string
	Script string
	Endonym string
	Exonym_en string
	Stage *string
	Language_family *string
	Area_used string
}

func GetLangs() ([]Language, error) {
	db, err := gorm.Open(sqlite.Open("../data/database.db"), &gorm.Config{})
	if err != nil {
		log.Fatalln("Failed to connect!", err)
	}
	ctx := context.Background()

	db.AutoMigrate(&Language{})
	// err = gorm.G[Language](db).Create(ctx, &Language{ISO: "xba", Script: "Bhks", Endonym: "Mattam bhasa", Exonym_en: "Martabanese", Area_used: "Southeast Asia"})

	langs, err := gorm.G[Language](db).Find(ctx)
	return langs, err
}
