import React, { useEffect, useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import axios from 'axios';


axios.defaults.withCredentials = true; // important for cookies


function App() {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
// check session
axios.get('http://localhost:4000/api/auth/session')
.then(res => {
if (res.data.loggedIn) setUser(res.data.user);
})
.catch(console.error)
.finally(() => setLoading(false));
}, []);


if (loading) return <div style={{padding:20}}>Loading...</div>;


return (
<div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
<h2>Klickks Auth Demo</h2>


{!user ? (
<div style={{ display: 'flex', gap: 20 }}>
<div style={{ flex: 1 }}>
<h3>Register</h3>
<Register onSuccess={(u) => setUser(u)} />
</div>
<div style={{ flex: 1 }}>
<h3>Login</h3>
<Login onSuccess={(u) => setUser(u)} />
</div>
</div>
) : (
<Dashboard user={user} onLogout={() => setUser(null)} />
)}
</div>
);
}


export default App;