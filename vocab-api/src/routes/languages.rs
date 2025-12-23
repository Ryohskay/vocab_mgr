use rocket::serde::json::{self, Json};
use rocket::{get, post, put, delete};
use rocket_db_pools::Connection;

use crate::models::Language;
use crate::db::Vocabs;

#[get("/languages")]
pub async fn list(
    mut db: Connection<Vocabs>,
) -> Json<Vec<Language>> {
    let rows = sqlx::query_as::<_, Language>(
        r#"
        SELECT
            language_id,
            iso,
            script,
            endonym,
            exonym_en,
            stage,
            language_family,
            area_used
        FROM languages
        ORDER BY endonym
        "#
    )
    .fetch_all(&mut **db)
    .await
    .expect("DB error");

    Json(rows)
}

#[post("/languages", format = "json", data = "<language>")]
pub async fn create(
    mut db: Connection<Vocabs>,
    language: Json<Language>,
) -> Json<Language> {
    let result = sqlx::query_as::<_, Language>(
        r#"
        INSERT INTO languages (
            iso,
            script,
            endonym,
            exonym_en,
            stage,
            language_family,
            area_used
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING
            language_id,
            iso,
            script,
            endonym,
            exonym_en,
            stage,
            language_family,
            area_used
        "#
    )
    .bind(&language.iso)
    .bind(&language.script)
    .bind(&language.endonym)
    .bind(&language.exonym_en)
    .bind(&language.stage)
    .bind(&language.language_family)
    .bind(&language.area_used)
    .fetch_one(&mut **db)
    .await
    .expect("DB error");

    Json(result)
}

#[put("/languages/<language_id>", format = "json", data = "<language>")]
pub async fn update(
    mut db: Connection<Vocabs>,
    language_id: i64,
    language: Json<Language>,
) -> Json<Language> {
    let result = sqlx::query_as::<_, Language>(
        r#"
        UPDATE languages
        SET
            iso = ?,
            script = ?,
            endonym = ?,
            exonym_en = ?,
            stage = ?,
            language_family = ?,
            area_used = ?
        WHERE language_id = ?
        RETURNING
            language_id,
            iso,
            script,
            endonym,
            exonym_en,
            stage,
            language_family,
            area_used
        "#
    )
    .bind(&language.iso)
    .bind(&language.script)
    .bind(&language.endonym)
    .bind(&language.exonym_en)
    .bind(&language.stage)
    .bind(&language.language_family)
    .bind(&language.area_used)
    .bind(language_id)
    .fetch_one(&mut **db)
    .await
    .expect("DB error");

    Json(result)
}

#[delete("/languages/<language_id>")]
pub async fn delete(
    mut db: Connection<Vocabs>,
    language_id: i64,
) -> Json<json::Value> {
    sqlx::query(
        r#"
        DELETE FROM languages
        WHERE language_id = ?
        "#
    )
    .bind(language_id)
    .execute(&mut **db)
    .await
    .expect("DB error");

    Json(serde_json::json!({"success": true}))
}
