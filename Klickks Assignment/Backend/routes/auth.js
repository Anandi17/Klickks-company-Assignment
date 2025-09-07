const express = require('express');
router.post('/register', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email and password required' });


const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);


const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
stmt.run(email, hash, function (err) {
if (err) {
if (err.message && err.message.includes('UNIQUE')) {
return res.status(409).json({ message: 'Email already registered' });
}
return res.status(500).json({ message: 'Database error', error: err.message });
}


// set session
req.session.userId = this.lastID;
req.session.email = email;
res.json({ message: 'Registered', user: { id: this.lastID, email } });
});
stmt.finalize();
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
});


// Login
router.post('/login', (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email and password required' });


db.get('SELECT id, email, password_hash FROM users WHERE email = ?', [email], async (err, row) => {
if (err) return res.status(500).json({ message: 'Database error' });
if (!row) return res.status(401).json({ message: 'Invalid credentials' });


const match = await bcrypt.compare(password, row.password_hash);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });


// set session
req.session.userId = row.id;
req.session.email = row.email;


res.json({ message: 'Logged in', user: { id: row.id, email: row.email } });
});
});


// Logout
router.post('/logout', (req, res) => {
req.session.destroy((err) => {
if (err) return res.status(500).json({ message: 'Could not logout' });
res.clearCookie('connect.sid');
res.json({ message: 'Logged out' });
});
});


// Session check
router.get('/session', (req, res) => {
if (req.session && req.session.userId) {
res.json({ loggedIn: true, user: { id: req.session.userId, email: req.session.email } });
} else {
res.json({ loggedIn: false });
}
});


module.exports = router;