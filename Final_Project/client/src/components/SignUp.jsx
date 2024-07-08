import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        let data = await response.json()
      console.log(data.message); 
    } catch (error) {
      console.error('Registration was failed:', error);
      setError('Registration failed. Please check your details.');
    }
  };

  return (
    <div className="container" >
    <div className="form-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignUp}>
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
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <div className='navigate-container'>
          <p>
            Have an account?{' '}
            <Link to='/signIn' className='navigate-text'>
              Sign In
            </Link>
          </p>
        </div>
        </div>
      </form>
    </div>
    </div>
  );
}
