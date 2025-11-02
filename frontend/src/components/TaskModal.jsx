import React, { useState, useEffect } from 'react'
import api from '../utils/api'

export default function TaskModal({ task, onClose, onSaved }){
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState(task?.status || 'Pending')
  const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline).toISOString().slice(0,10) : '')
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    setTitle(task?.title || '')
    setDescription(task?.description || '')
    setStatus(task?.status || 'Pending')
    setDeadline(task?.deadline ? new Date(task.deadline).toISOString().slice(0,10) : '')
  }, [task])

  const save = async () => {
    if (!title) return alert('Title required')
    setSaving(true)
    try {
      if (task) {
        const { data } = await api.put(`/tasks/${task._id}`, { title, description, status, deadline: deadline || null })
        onSaved(data, false)
      } else {
        const { data } = await api.post('/tasks', { title, description, status, deadline: deadline || null })
        onSaved(data, true)
      }
    } catch (err) {
      console.error(err)
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4' onClick={onClose}>
      <div className='bg-white w-full max-w-md rounded p-4' onClick={e => e.stopPropagation()}>
        <h3 className='text-lg font-semibold mb-2'>{task ? 'Edit Task' : 'New Task'}</h3>
        <div className='space-y-2'>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className='w-full p-2 border rounded' placeholder='Title' />
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className='w-full p-2 border rounded' placeholder='Description' />
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className='w-full p-2 border rounded'>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <input type='date' value={deadline} onChange={(e)=>setDeadline(e.target.value)} className='w-full p-2 border rounded' />
        </div>
        <div className='mt-4 flex justify-end space-x-2'>
          <button onClick={onClose} className='px-3 py-1 border rounded hover:bg-gray-50'>Cancel</button>
          <button onClick={save} disabled={saving} className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400'>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}