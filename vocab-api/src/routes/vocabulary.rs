use rocket::serde::json::Json;
use rocket::{get, post, put, delete};
use rocket_db_pools::{Connection, sqlx};

use crate::models::VocabularyEntry;
use crate::db::Vocabs;

#[get("/languages/<language_id>/vocabulary")]
pub async fn list(
    mut db: Connection<Vocabs>,
    language_id: i64,
) -> Json<Vec<VocabularyEntry>> {
    let rows = sqlx::query_as(
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

#[post("/vocabulary", data = "<entry>")]
pub async fn create(
    mut db: DbConn,
    entry: Json<VocabularyEntry>,
) {
    sqlx::query!(
        r#"
        INSERT INTO vocabulary
        (language_id, part_of_speech, lemma, transliteration,
         origin_lang, process, etymology_notes, tag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
        entry.language_id,
        entry.part_of_speech,
        entry.lemma,
        entry.transliteration,
        entry.origin_lang,
        entry.process,
        entry.etymology_notes,
        entry.tag,
        entry.notes
    )
    .execute(&mut *db)
    .await
    .expect("Insert failed");
}

#[put("/vocabulary/<id>", data = "<entry>")]
pub async fn update(
    mut db: DbConn,
    id: i64,
    entry: Json<VocabularyEntry>,
) {
    sqlx::query!(
        r#"
        UPDATE vocabulary SET
            part_of_speech = ?,
            lemma = ?,
            transliteration = ?,
            origin_lang = ?,
            process = ?,
            etymology_notes = ?,
            tag = ?,
            notes = ?
        WHERE word_id = ?
        "#,
        entry.part_of_speech,
        entry.lemma,
        entry.transliteration,
        entry.origin_lang,
        entry.process,
        entry.etymology_notes,
        entry.tag,
        entry.notes,
        id
    )
    .execute(&mut *db)
    .await
    .expect("Update failed");
}

#[delete("/vocabulary/<id>")]
pub async fn delete_word(mut db: DbConn, id: i64) {
    sqlx::query!(
        "DELETE FROM vocabulary WHERE word_id = ?",
        id
    )
    .execute(&mut *db)
    .await
    .expect("Delete failed");
}
