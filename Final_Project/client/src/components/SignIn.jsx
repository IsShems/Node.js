import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signin', credentials);
            const { token } = response.data
            if (token) {
                sessionStorage.setItem('token', token)
                navigate("/chat/Sahib")
            }
        } catch (error) {
            setErrorMessage('Login failed:( Please check your username and password!');
        }
    };

    return (
        <div className="container" >
            <div className="form-container">
                <h2>Sign In</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <form onSubmit={handleSignIn}>
                    <div className="form-group-div">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Sign In</button>
                        <div className='navigate-container'>
                            <p>
                                Don't have an account?{' '}
                                <Link to='/signUp' className='navigate-text'>
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
