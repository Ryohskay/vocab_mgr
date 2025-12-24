#[macro_use] extern crate rocket;

use rocket_db_pools::Database;
use rocket_db_pools::Connection;
use vocab_api::db;

#[get("/health")]
async fn health(mut db: Connection<db::Vocabs>) -> &'static str {
    // Initialize database on first health check
    let _ = db::init_db(&mut *db).await;
    "OK"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(db::Vocabs::init())
        .mount("/api", routes![
            health,
            vocab_api::routes::vocabulary::list,
            vocab_api::routes::vocabulary::create,
            vocab_api::routes::vocabulary::update,
            vocab_api::routes::vocabulary::delete,
            vocab_api::routes::languages::list,
            vocab_api::routes::languages::create,
            vocab_api::routes::languages::update,
            vocab_api::routes::languages::delete
        ])
}
