import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8000'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password })
      const token = res.data.access_token
      localStorage.setItem('access_token', token)
      navigate('/dashboard')
    }catch(err){
      setError(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <h2>Sign in</h2>
        <p className="subtitle">Use your existing account to access the assistant.</p>
        {error && <div className="error">{error}</div>}
        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Sign in</button>
        <p className="helper-text">
          Don&apos;t have an account? <Link to="/register">Create one</Link>.
        </p>
      </form>
    </div>
  )
}
