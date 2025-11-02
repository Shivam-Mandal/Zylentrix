import React, { useState, useContext } from 'react'
import api from '../utils/api'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/signup', { name, email, password })
      await login(data)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-12 bg-white p-6 rounded shadow'>
      <h2 className='text-2xl font-semibold mb-4'>Sign up</h2>
      {error && <div className='text-red-600 mb-2'>{error}</div>}
      <form onSubmit={submit} className='space-y-3'>
        <input className='w-full p-2 border rounded' placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} />
        <input className='w-full p-2 border rounded' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type='password' className='w-full p-2 border rounded' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className='w-full p-2 bg-green-600 text-white rounded'>Sign up</button>
      </form>
      <p className='mt-4 text-sm'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></p>
    </div>
  )
}