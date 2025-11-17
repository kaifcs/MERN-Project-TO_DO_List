import express from 'express';
import Task from '../models/Task.js';
import validateObjectId from '../utils/validateObjectId.js';

const router = express.Router();

// GET /api/tasks?search=&completed=true|false
router.get('/', async (req, res, next) => {
  try {
    const { search, completed } = req.query;
    const q = {};
    if (typeof search === 'string' && search.trim()) {
      q.title = { $regex: search.trim(), $options: 'i' };
    }
    if (typeof completed !== 'undefined') {
      if (completed === 'true' || completed === 'false') {
        q.completed = completed === 'true';
      }
    }
    const tasks = await Task.find(q).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) { next(e); }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const task = await Task.create({ title, completed });
    res.status(201).json(task);
  } catch (e) { next(e); }
});

// GET /api/tasks/:id
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

// PATCH /api/tasks/:id -> partial update (toggle or rename)
router.patch('/:id', validateObjectId, async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const updates = {};
    if (typeof title !== 'undefined') updates.title = title;
    if (typeof completed !== 'undefined') updates.completed = completed;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

// DELETE /api/tasks/:id
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted', id: task.id });
  } catch (e) { next(e); }
});

export default router;
