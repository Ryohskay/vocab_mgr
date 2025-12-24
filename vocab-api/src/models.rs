use rocket::serde::{Serialize, Deserialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct VocabularyEntry {
    pub word_id: Option<i64>,
    pub language_id: i64,
    pub part_of_speech: String,
    pub lemma: String,
    pub transliteration: Option<String>,
    pub definition: Option<String>,
    pub origin_lang: Option<String>,
    pub process: Option<String>,
    pub etymology_notes: Option<String>,
    pub tag: Option<String>,
    pub notes: Option<String>,
}

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Language {
    pub language_id: Option<i64>,
    pub iso: String,
    pub script: Option<String>,
    pub endonym: String,
    pub exonym_en: Option<String>,
    pub stage: Option<String>,
    pub language_family: Option<String>,
    pub area_used: Option<String>,
}