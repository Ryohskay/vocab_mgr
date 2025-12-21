use rocket::serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct VocabularyEntry {
    pub word_id: Option<i64>,
    pub language_id: i64,
    pub part_of_speech: String,
    pub lemma: String,
    pub transliteration: Option<String>,
    pub origin_lang: Option<String>,
    pub process: Option<String>,
    pub etymology_notes: Option<String>,
    pub tag: Option<String>,
    pub notes: Option<String>,
}