# vocab\_mgr

Vocabulary management tool for my own conlang(s).


## Tech stack

* DB: SQLite3
* Backend (API to control CRUD of DB): [Gin](https://github.com/gin-gonic/gin), [modernc.org/sqlite](https://github.com/modernc-org/sqlite)
* Frontend (GUI that calls the backend API): [React](https://github.com/facebook/react) + [Vite](https://github.com/vitejs/vite)

## How to set up the devices
Run `go run ./configure/main.go`.

## How to build the backend

* `cd backend`
* `.\build.ps1`

## How to run the frontend

* `cd frontend`
* `npm run dev`
