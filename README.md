Metod POST
URL http://localhost:3000/api/auth/register
Yuboriladigan ma'lumot (Request Body)

{
"username": "testuser1",
"first_name": "Jamshid",
"email": "jamshid@example.com",
"password": "MeningSirliParolim"
}

---

Metod POST
URL http://localhost:3000/api/auth/login

{
"username": "testuser1",
"password": "MeningSirliParolim"
}
Muvaffaqiyatli kirishda siz quyidagilarni olasiz:

{
"token": "...",
"role": "user"
}

---

URL http://localhost:3000/api/user/me
Talab Authorization Header

{
"id": 1,
"username": "testuser1",
"first_name": "Jamshid",
"email": "jamshid@example.com",
"role": "user"
}
