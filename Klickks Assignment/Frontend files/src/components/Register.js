import React, { useState } from 'react';
import axios from 'axios';


export default function Register({ onSuccess }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState(null);


const submit = async (e) => {
e.preventDefault();
setMessage(null);
try {
const res = await axios.post('http://localhost:4000/api/auth/register', { email, password }, { withCredentials: true });
setMessage(res.data.message);
onSuccess && onSuccess(res.data.user);
} catch (err) {
setMessage(err.response?.data?.message || 'Error');
}
};


return (
<form onSubmit={submit}>
<div style={{ marginBottom: 8 }}>
<input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
</div>
<div style={{ marginBottom: 8 }}>
<input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
</div>
<button type="submit">Register</button>
{message && <div style={{ marginTop: 8 }}>{message}</div>}
</form>
);
}