export async function emailExists(db, email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows.length > 0;
}

export async function usernameExists(db, username) {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows.length > 0;
}

export async function insertUser(db, user) {
    const result = await db.query(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
        [user.email, user.username, user.password]
    );
    const userId = result.rows[0].id;
    console.log("User ID:", userId);
    await db.query(
        "INSERT INTO user_information (id, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4)",
        [
            userId,
            user.firstName,
            user.lastName,
            user.phoneNumber || null
        ]
    );

    return userId;
}

export async function getUserByEmail(db, email) {
    const result = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    return result.rows[0];
}
