use rocket_db_pools::Database;
use rocket_db_pools::sqlx;

#[derive(Database)]
#[database("vocabs")]
pub struct Vocabs(sqlx::SqlitePool);

pub async fn init_db(db: &mut sqlx::SqliteConnection) -> Result<(), sqlx::Error> {
    // Create languages table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS languages (
            language_id INTEGER PRIMARY KEY AUTOINCREMENT,
            iso TEXT NOT NULL,
            script TEXT,
            endonym TEXT NOT NULL,
            exonym_en TEXT,
            stage TEXT,
            language_family TEXT,
            area_used TEXT
        )
        "#,
    )
    .execute(&mut *db)
    .await?;

    // Create vocabulary table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS vocabulary (
            word_id INTEGER PRIMARY KEY AUTOINCREMENT,
            language_id INTEGER NOT NULL,
            part_of_speech TEXT NOT NULL,
            lemma TEXT NOT NULL,
            transliteration TEXT,
            definition TEXT,
            origin_lang TEXT,
            process TEXT,
            etymology_notes TEXT,
            tag TEXT,
            notes TEXT,
            FOREIGN KEY (language_id) REFERENCES languages(language_id)
        )
        "#,
    )
    .execute(&mut *db)
    .await?;

    Ok(())
}
