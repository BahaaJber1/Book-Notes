import bcrypt from "bcryptjs";


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

export async function cheackPassword(db, username, password) {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    }
    return false;
}

// still needs imporvement to limit attempts and lockout
export async function login(db, userCredentials) {
    const { username, password } = userCredentials;
    if (await usernameExists(db, username)) {
        if(await cheackPassword(db, username, password))
        {
            return true;
        } 
    }
    return false;
}
