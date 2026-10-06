const express = require('express');
const db = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All papers routes require authentication
router.use(authMiddleware);

// GET /api/papers - Get all papers for the authenticated user
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, user_id, title, authors, year, category, status, priority, notes, created_at
      FROM papers
      WHERE user_id = ?
      ORDER BY id DESC
    `);
    const papers = stmt.all(req.user.id);
    return res.json(papers);
  } catch (err) {
    console.error('Fetch papers error:', err);
    return res.status(500).json({ error: 'Server error while fetching papers.' });
  }
});

// GET /api/papers/:id - Get a specific paper
router.get('/:id', (req, res) => {
  try {
    const paperId = Number(req.params.id);
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID.' });
    }

    const stmt = db.prepare(`
      SELECT id, user_id, title, authors, year, category, status, priority, notes, created_at
      FROM papers
      WHERE id = ? AND user_id = ?
    `);
    const paper = stmt.get(paperId, req.user.id);

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found.' });
    }

    return res.json(paper);
  } catch (err) {
    console.error('Fetch paper detail error:', err);
    return res.status(500).json({ error: 'Server error while fetching paper details.' });
  }
});

// POST /api/papers - Add a new paper
router.post('/', (req, res) => {
  try {
    const { title, authors, year, category, status, priority, notes } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const parsedYear = year ? parseInt(year, 10) : null;
    const finalCategory = category || 'Other';
    const finalStatus = status || 'To Read';
    const finalPriority = priority || 'Medium';

    const insertStmt = db.prepare(`
      INSERT INTO papers (user_id, title, authors, year, category, status, priority, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      req.user.id,
      title.trim(),
      authors ? authors.trim() : '',
      isNaN(parsedYear) ? null : parsedYear,
      finalCategory,
      finalStatus,
      finalPriority,
      notes ? notes.trim() : ''
    );

    const newId = Number(result.lastInsertRowid);
    const selectStmt = db.prepare('SELECT * FROM papers WHERE id = ?');
    const createdPaper = selectStmt.get(newId);

    return res.status(201).json(createdPaper);
  } catch (err) {
    console.error('Add paper error:', err);
    return res.status(500).json({ error: 'Server error while creating paper.' });
  }
});

// PUT /api/papers/:id - Update an existing paper
router.put('/:id', (req, res) => {
  try {
    const paperId = Number(req.params.id);
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID.' });
    }

    const { title, authors, year, category, status, priority, notes } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    // Check ownership
    const checkStmt = db.prepare('SELECT id FROM papers WHERE id = ? AND user_id = ?');
    const existing = checkStmt.get(paperId, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Paper not found or unauthorized.' });
    }

    const parsedYear = year ? parseInt(year, 10) : null;
    const updateStmt = db.prepare(`
      UPDATE papers
      SET title = ?, authors = ?, year = ?, category = ?, status = ?, priority = ?, notes = ?
      WHERE id = ? AND user_id = ?
    `);

    updateStmt.run(
      title.trim(),
      authors ? authors.trim() : '',
      isNaN(parsedYear) ? null : parsedYear,
      category || 'Other',
      status || 'To Read',
      priority || 'Medium',
      notes ? notes.trim() : '',
      paperId,
      req.user.id
    );

    const selectStmt = db.prepare('SELECT * FROM papers WHERE id = ?');
    const updatedPaper = selectStmt.get(paperId);

    return res.json(updatedPaper);
  } catch (err) {
    console.error('Update paper error:', err);
    return res.status(500).json({ error: 'Server error while updating paper.' });
  }
});

// DELETE /api/papers/:id - Delete a paper
router.delete('/:id', (req, res) => {
  try {
    const paperId = Number(req.params.id);
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID.' });
    }

    // Check ownership
    const checkStmt = db.prepare('SELECT id FROM papers WHERE id = ? AND user_id = ?');
    const existing = checkStmt.get(paperId, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Paper not found or unauthorized.' });
    }

    const deleteStmt = db.prepare('DELETE FROM papers WHERE id = ? AND user_id = ?');
    deleteStmt.run(paperId, req.user.id);

    return res.json({ message: 'Paper deleted successfully.', id: paperId });
  } catch (err) {
    console.error('Delete paper error:', err);
    return res.status(500).json({ error: 'Server error while deleting paper.' });
  }
});

module.exports = router;

