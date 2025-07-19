# Book Notes Project

<img width="1895" height="898" alt="image" src="https://github.com/user-attachments/assets/88a23c59-f529-4d71-beb9-89f072d1907a" />

<img width="1907" height="897" alt="image" src="https://github.com/user-attachments/assets/e3ff8592-1001-4639-bbbb-d6ca244107ec" />

<img width="1894" height="902" alt="image" src="https://github.com/user-attachments/assets/253bd234-9690-4bdd-b34c-fd9866a754d4" />




A dynamic web application that allows users to explore books, add personalized notes, and manage their book collection. The app integrates with the Open Library API to fetch book details and covers, and uses PostgreSQL for secure data storage.

---

## Features

- **Book Exploration:** Search for books and view details with cover images fetched from the Open Library API.
- **Personalized Notes:** Add notes for specific books.
- **User Authentication:** Secure registration and login with hashed passwords (bcrypt).
- **Session Management:** Persistent login sessions using express-session.
- **Database Integration:** PostgreSQL for storing users, books, and notes.

---

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- PostgreSQL
- Axios (for API requests)
- bcrypt (for password hashing)
- express-session
- dotenv

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-github-username>/book-notes-project.git
   cd book-notes-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the PostgreSQL database:**
   - Create a database named `booknotes`.
   - Create a `users` table and a `books` table. Example schema:
     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
     );

     CREATE TABLE books (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       title VARCHAR(255),
       author VARCHAR(255),
       cover_url TEXT,
       note TEXT
     );
     ```

4. **Create a `.env` file in the root directory:**
   ```env
   SESSION_SECRET=your_session_secret
   PG_USER=your_postgres_user
   PG_HOST=localhost
   PG_DATABASE=booknotes
   PG_PASSWORD=your_postgres_password
   PG_PORT=5432
   ```

5. **Start the server:**
   ```bash
   node index.js
   ```

6. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

---

## Folder Structure

```
book-notes-project/
├── public/                 # Static files (CSS, images, etc.)
├── views/                  # EJS templates
│   ├── explore.ejs
│   ├── booknote.ejs
│   ├── signin.ejs
│   ├── signup.ejs
│   └── partials/
├── index.js                # Main server file
├── package.json
├── .env
└── README.md
```

---

## Security Notes

- Passwords are hashed using bcrypt before being stored in the database.
- Sessions are signed using a secret from the `.env` file.
- All SQL queries use parameterized statements to prevent SQL injection.

---

## Author

Developed by [BahaaJber](https://github.com/BahaaJber1).

---

## License

This project is licensed under the MIT License.
