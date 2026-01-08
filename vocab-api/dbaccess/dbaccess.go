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

// Vocabulary belongs to Language
type Vocabulary struct {
	gorm.Model
	LangID uint
	PartOfSpeech string
	Lemma string
	Definition string
	Transliteration *string
	OriginLang *string
	EtymologyNotes *string
	Tag *string
	Notes *string
	Language Language `gorm:"foreignKey:LangID"`
}

func DbConnInit() (*gorm.DB, context.Context) {
	// initialise the DB connection
	// return the initialised context
	db, err := gorm.Open(sqlite.Open("../data/database.db"), &gorm.Config{})
	if err != nil {
		log.Fatalln("Failed to connect!", err)
	}
	ctx := context.Background()

	db.AutoMigrate(&Language{})
	db.AutoMigrate(&Vocabulary{})

	return db, ctx
}

func GetLangs(db *gorm.DB, ctx context.Context) ([]Language, error) {
	// err = gorm.G[Language](db).Create(ctx, &Language{ISO: "xba", Script: "Bhks", Endonym: "Mattam bhasa", Exonym_en: "Martabanese", Area_used: "Southeast Asia"})

	langs, err := gorm.G[Language](db).Find(ctx)
	return langs, err
}

func GetVocabsByLang(langId uint, db *gorm.DB, ctx context.Context) ([]Vocabulary, error) {
	vocabs, err := gorm.G[Vocabulary](db).Where("lang_id = ?", langId).Find(ctx)
	return vocabs, err
}
