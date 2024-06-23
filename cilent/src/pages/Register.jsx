import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useHistory, useNavigate} from 'react-router-dom';
import Layout from "../components/Layout";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const history = useNavigate();

    useEffect(() => {
        const checkUsername = async () => {
            if (username) {
                try {
                    const res = await axios.post('http://localhost:7000/api/auth/check-username', { username });
                    setUsernameExists(res.data.exists);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        const timeoutId = setTimeout(checkUsername, 500); // Đợi 500ms sau khi người dùng dừng nhập liệu
        return () => clearTimeout(timeoutId); // Xóa bỏ timeout khi người dùng nhập tiếp
    }, [username]);

    useEffect(() => {
        const checkEmail = async () => {
            if (email) {
                try {
                    const res = await axios.post('http://localhost:7000/api/auth/check-email', { email });
                    setEmailExists(res.data.exists);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        const timeoutId = setTimeout(checkEmail, 500); // Đợi 500ms sau khi người dùng dừng nhập liệu
        return () => clearTimeout(timeoutId); // Xóa bỏ timeout khi người dùng nhập tiếp
    }, [email]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (usernameExists || emailExists) {
            setError('Username or Email already exists');
            return;
        }

        try {
            const res = await axios.post('http://localhost:7000/api/auth/register', { username, email, password });
            if (res.status === 201) {
                alert('Đăng ký thành công');
                history('/login');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <Layout>
            <div style={styles.body}>
                <div style={styles.main}>
                    <h2>Registration Form</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={onSubmit}>
                        <label style={styles.label} htmlFor="username">User name:</label>
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
                        {usernameExists && <p style={{ color: 'red' }}>Username already exists</p>}

                        <label style={styles.label} htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email"
                            required
                            style={styles.input}
                        />
                        {emailExists && <p style={{ color: 'red' }}>Email already exists</p>}

                        <label style={styles.label} htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])\S{8,}$"
                            title="Password must contain at least one number, one alphabet, one symbol, and be at least 8 characters long"
                            required
                            style={styles.input}
                        />

                        <label style={styles.label} htmlFor="confirmPassword">Re-type Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-type your Password"
                            required
                            style={styles.input}
                        />

                        <button type="submit" style={styles.button}>Submit</button>
                    </form>
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
        minHeight: '80vh',
        background: '#f3f3f3',
        flexDirection: 'column',
        margin: 0,
    },
    main: {
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        width: '700px',
        textAlign: 'center',
    },
    h2: {
        color: '#4CAF50',
        marginBottom: '20px',
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
};

export default Register;
