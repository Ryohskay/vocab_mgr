#[macro_use] extern crate rocket;

use rocket_db_pools::Database;

mod db;
mod models;
mod routes;

use routes::vocabulary::*;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(db::Vocabs::init())
        .mount("/api", routes![
            list,
            create,
            update,
            delete_word
        ])
}
