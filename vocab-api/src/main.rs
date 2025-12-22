#[macro_use] extern crate rocket;

use rocket_db_pools::Database;
use vocab_api::{db, routes};

use routes::vocabulary::*;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(db::Vocabs::init())
        .mount("/api", routes![
            list,
            create,
            update,
            delete
        ])
}
