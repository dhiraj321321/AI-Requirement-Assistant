import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8000'

export default function Register(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await axios.post(`${API_BASE}/api/auth/register`, { username, password, email })
      setSuccess('Registration successful. Redirecting to login...')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <h2>Create account</h2>
        <p className="subtitle">Register a new user and then sign in to access the assistant.</p>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <label>Email (optional)</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
        <p className="helper-text">
          Already registered? <Link to="/">Sign in</Link>.
        </p>
      </form>
    </div>
  )
}
