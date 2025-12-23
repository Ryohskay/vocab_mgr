#[macro_use] extern crate rocket;

use rocket_db_pools::Database;
use vocab_api::db;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(db::Vocabs::init())
        .mount("/api", routes![
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
