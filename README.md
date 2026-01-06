# vocab\_mgr

Vocabulary management tool for my own conlang(s).


## Tech stack

* DB: SQLite
* Backend (API to control CRUD of DB): Rocket.rs
* Frontend (GUI that calls the backend API): React + Vite

## How to set up the devices
Run `go run ./configure/main.go`.

## How to build the backend

* `cd vocab-api`
* `cargo build --release`

## How to run the frontend

* `cd vocab-client`
* `npm run dev`
