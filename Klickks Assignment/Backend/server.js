const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const SQLiteStore = require('connect-sqlite3')(session);


const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// CORS - allow frontend origin. Adjust origin in production.
app.use(cors({
origin: 'http://localhost:3000',
credentials: true
}));


// Session store - using sqlite-backed store for demonstration (helps sessions survive restarts)
app.use(
session({
store: new SQLiteStore({ db: 'sessions.db', dir: path.join(__dirname) }),
name: 'connect.sid',
secret: process.env.SESSION_SECRET || 'change-this-secret',
resave: false,
saveUninitialized: false,
cookie: {
httpOnly: true,
secure: false, // set true if using HTTPS
sameSite: 'lax',
maxAge: 1000 * 60 * 60 * 24 // 1 day
}
})
);


// Routes
app.use('/api/auth', authRoutes);


// Simple protected API example
app.get('/api/protected', (req, res) => {
if (req.session && req.session.userId) {
return res.json({ message: 'This is protected data', user: { id: req.session.userId, email: req.session.email } });
}
res.status(401).json({ message: 'Unauthorized' });
});


app.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`);
});