import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signin', formData);
            const { token } = response.data;
            if (token) {
                sessionStorage.setItem('token', token);
                navigate("/chat/Sasha");
            }
        } catch (error) {
            setError('Login failed:( Please check your username and password!');
        }
    };

    return (
        <div className="container" >
            <div className="form-container">
                <h2>Sign In</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSignIn}>
                    <div className="form-group-div">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Sign In</button>
                        <div className='navigate-container'>
                            <p>
                                Do not have an account?{' '}
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
