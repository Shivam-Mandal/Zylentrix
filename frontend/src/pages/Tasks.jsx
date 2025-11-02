import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'

export default function Tasks(){
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ status: '', deadlineBefore: '' })
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.status) params.status = filter.status
      if (filter.deadlineBefore) params.deadlineBefore = filter.deadlineBefore
      const { data } = await api.get('/tasks', { params })
      setTasks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [filter])

  const openNew = () => { setEditingTask(null); setShowModal(true) }
  const openEdit = (task) => { setEditingTask(task); setShowModal(true) }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`)
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      alert('Delete failed')
    }
  }

  const upsertTask = (task, created) => {
    if (created) setTasks(prev => [task, ...prev])
    else setTasks(prev => prev.map(t => t._id === task._id ? task : t))
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4'>
        <div className='flex gap-2'>
          <select value={filter.status} onChange={(e)=>setFilter({...filter, status: e.target.value})} className='p-2 border rounded'>
            <option value=''>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <input type='date' value={filter.deadlineBefore} onChange={(e)=>setFilter({...filter, deadlineBefore: e.target.value})} className='p-2 border rounded' />
          <button onClick={()=>setFilter({ status: '', deadlineBefore: '' })} className='p-2 border rounded'>Reset</button>
        </div>
        <div>
          <button onClick={openNew} className='bg-blue-600 text-white px-4 py-2 rounded'>Add Task</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {tasks.length === 0 && <div className='text-gray-500'>No tasks</div>}
          {tasks.map(t => (
            <TaskCard key={t._id} task={t} onEdit={()=>openEdit(t)} onDelete={()=>handleDelete(t._id)} />
          ))}
        </div>
      )}

      {showModal && <TaskModal onClose={()=>setShowModal(false)} task={editingTask} onSaved={(task, created)=>{ upsertTask(task, created); setShowModal(false) }} />}
    </div>
  )
}