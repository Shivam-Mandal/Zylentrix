import React from 'react'

export default function TaskCard({ task, onEdit, onDelete }){
  const due = task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'
  return (
    <div className='bg-white p-4 rounded shadow flex flex-col justify-between'>
      <div>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>{task.title}</h3>
          <span className='text-sm'>{task.status}</span>
        </div>
        <p className='text-sm text-gray-600 mt-2'>{task.description}</p>
      </div>
      <div className='mt-4 flex items-center justify-between'>
        <small className='text-xs text-gray-500'>Due: {due}</small>
        <div className='space-x-2'>
          <button onClick={onEdit} className='text-sm px-2 py-1 border rounded hover:bg-gray-50'>Edit</button>
          <button onClick={onDelete} className='text-sm px-2 py-1 border rounded hover:bg-gray-50 hover:text-red-600'>Delete</button>
        </div>
      </div>
    </div>
  )
}