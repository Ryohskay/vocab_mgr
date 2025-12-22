use rocket::serde::json::Json;
use rocket::{get, post, put, delete};
use rocket_db_pools::{Connection, sqlx};

use rocket::serde::json;
use crate::models::VocabularyEntry;
use crate::db::Vocabs;

#[get("/languages/<language_id>/vocabulary")]
pub async fn list(
    mut db: Connection<Vocabs>,
    language_id: i64,
) -> Json<Vec<VocabularyEntry>> {
    let rows = sqlx::query_as::<_, VocabularyEntry>(
        r#"
        SELECT
            word_id as "word_id?",
            language_id,
            part_of_speech,
            lemma,
            transliteration,
            origin_lang,
            process,
            etymology_notes,
            tag,
            notes
        FROM vocabulary
        WHERE language_id = ?
        ORDER BY lemma
        "#
    )
    .bind(language_id)
    .fetch_all(&mut **db)
    .await
    .expect("DB error");

    Json(rows)
}

#[post("/languages/<language_id>/vocabulary", format = "json", data = "<entry>")]
pub async fn create(
    mut db: Connection<Vocabs>,
    language_id: i64,
    entry: Json<VocabularyEntry>,
) -> Json<VocabularyEntry> {
    let result = sqlx::query_as::<_, VocabularyEntry>(
        r#"
        INSERT INTO vocabulary (
            language_id,
            part_of_speech,
            lemma,
            transliteration,
            origin_lang,
            process,
            etymology_notes,
            tag,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING
            word_id as "word_id?",
            language_id,
            part_of_speech,
            lemma,
            transliteration,
            origin_lang,
            process,
            etymology_notes,
            tag,
            notes
        "#
    )
    .bind(language_id)
    .bind(&entry.part_of_speech)
    .bind(&entry.lemma)
    .bind(&entry.transliteration)
    .bind(&entry.origin_lang)
    .bind(&entry.process)
    .bind(&entry.etymology_notes)
    .bind(&entry.tag)
    .bind(&entry.notes)
    .fetch_one(&mut **db)
    .await
    .expect("DB error");

    Json(result)
}

#[put("/languages/<language_id>/vocabulary/<word_id>", format = "json", data = "<entry>")]
pub async fn update(
    mut db: Connection<Vocabs>,
    language_id: i64,
    word_id: i64,
    entry: Json<VocabularyEntry>,
) -> Json<VocabularyEntry> {
    let result = sqlx::query_as::<_, VocabularyEntry>(
        r#"
        UPDATE vocabulary
        SET
            part_of_speech = ?,
            lemma = ?,
            transliteration = ?,
            origin_lang = ?,
            process = ?,
            etymology_notes = ?,
            tag = ?,
            notes = ?
        WHERE word_id = ? AND language_id = ?
        RETURNING
            word_id as "word_id?",
            language_id,
            part_of_speech,
            lemma,
            transliteration,
            origin_lang,
            process,
            etymology_notes,
            tag,
            notes
        "#
    )
    .bind(&entry.part_of_speech)
    .bind(&entry.lemma)
    .bind(&entry.transliteration)
    .bind(&entry.origin_lang)
    .bind(&entry.process)
    .bind(&entry.etymology_notes)
    .bind(&entry.tag)
    .bind(&entry.notes)
    .bind(word_id)
    .bind(language_id)
    .fetch_one(&mut **db)
    .await
    .expect("DB error");

    Json(result)
}

#[delete("/languages/<language_id>/vocabulary/<word_id>")]
pub async fn delete(
    mut db: Connection<Vocabs>,
    language_id: i64,
    word_id: i64,
) -> Json<json::Value> {
    sqlx::query(
        r#"
        DELETE FROM vocabulary
        WHERE word_id = ? AND language_id = ?
        "#
    )
    .bind(word_id)
    .bind(language_id)
    .execute(&mut **db)
    .await
    .expect("DB error");

    Json(serde_json::json!({"success": true}))
}
