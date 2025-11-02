import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()

  const handleLogout = async () => {
    await logout()
    nav('/login')
  }

  return (
    <nav className='bg-white shadow'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <Link to='/' className='font-bold text-lg'>TaskApp</Link>
        <div>
          {user ? (
            <div className='flex items-center space-x-3'>
              <span className='hidden sm:inline'>{user.name}</span>
              <button onClick={handleLogout} className='text-sm px-3 py-1 border rounded hover:bg-gray-50'>Logout</button>
            </div>
          ) : (
            <div className='space-x-3'>
              <Link to='/login' className='text-sm hover:text-blue-600'>Login</Link>
              <Link to='/signup' className='text-sm hover:text-blue-600'>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}