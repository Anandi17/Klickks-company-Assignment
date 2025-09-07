import React from 'react';
import axios from 'axios';


export default function Dashboard({ user, onLogout }) {
const logout = async () => {
try {
await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
onLogout && onLogout();
} catch (err) {
console.error(err);
onLogout && onLogout();
}
};


return (
<div>
<h3>Welcome, {user.email}</h3>
<p>User ID: {user.id}</p>
<button onClick={logout}>Logout</button>
</div>
)
}