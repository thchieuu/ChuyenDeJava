import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:7000/api/auth/login', { username, password });
            if (res.status === 200) {

                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', username); // Lưu username vào localStorage
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <Layout>
            <div style={styles.body}>
                <div style={styles.main}>
                    <h3>Login</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={onSubmit}>
                        <label style={styles.label} htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your Username"
                            required
                            style={styles.input}
                        />

                        <label style={styles.label} htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            required
                            style={styles.input}
                        />

                        <div style={styles.wrap}>
                            <button type="submit" style={styles.button}>Submit</button>
                        </div>
                    </form>
                    <p>Not registered? <a href="/register" style={styles.link}>Create an account</a></p>
                </div>
            </div>
        </Layout>
    );
};

const styles = {
    body: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        lineHeight: '1.5',
        minHeight: '60vh',
        background: '#f3f3f3',
        flexDirection: 'column',
        margin: 0,
    },
    main: {
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
        padding: '10px 20px',
        transition: 'transform 0.2s',
        width: '500px',
        textAlign: 'center',
    },
    h3: {
        color: '#4CAF50',
    },
    label: {
        display: 'block',
        width: '100%',
        marginTop: '10px',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        display: 'block',
        width: '100%',
        marginBottom: '15px',
        padding: '10px',
        boxSizing: 'border-box',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    button: {
        padding: '15px',
        borderRadius: '10px',
        marginTop: '15px',
        marginBottom: '15px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        backgroundColor: '#4CAF50',
        width: '100%',
        fontSize: '16px',
    },
    wrap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        textDecoration: 'none',
        color: '#4CAF50',
    },
};

export default Login;
