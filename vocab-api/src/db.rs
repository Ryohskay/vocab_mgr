use rocket_db_pools::Database;
use rocket_db_pools::sqlx;

#[derive(Database)]
#[database("vocabs")]
pub struct Vocabs(sqlx::SqlitePool);
