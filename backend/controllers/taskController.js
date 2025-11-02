// controllers/tasksController.js
import Task from '../models/Task.js';

/**
 * GET /api/tasks
 * Query params: status, deadlineBefore, page, limit
 */
export const getTasks = async (req, res) => {
  try {
    const { status, deadlineBefore, page = 1, limit = 100 } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;
    if (deadlineBefore) query.deadline = { $lte: new Date(deadlineBefore) };

    const parsedLimit = Math.min(parseInt(limit, 10) || 100, 1000); // safety cap
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit);

    res.json(tasks);
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const task = new Task({
      user: req.user._id,
      title,
      description,
      status,
      deadline
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, deadline } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Not found' });

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.deadline = deadline ?? task.deadline;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error('updateTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
