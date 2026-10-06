const bcrypt = require('bcryptjs');
const db = require('./db');

function seedDatabase() {
  console.log('Seeding database...');

  // Check if demo user already exists
  const checkUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  let user = checkUserStmt.get('demo@example.com');

  if (!user) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('demo123', salt);
    const insertUserStmt = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `);
    const result = insertUserStmt.run('Demo Researcher', 'demo@example.com', hashedPassword);
    user = { id: Number(result.lastInsertRowid) };
    console.log(`Created demo user with ID: ${user.id}`);
  } else {
    console.log(`Demo user exists with ID: ${user.id}`);
  }

  // Check existing papers count for this user
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM papers WHERE user_id = ?');
  const { count } = countStmt.get(user.id);

  if (count === 0) {
    const insertPaperStmt = db.prepare(`
      INSERT INTO papers (user_id, title, authors, year, category, status, priority, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedPapers = [
      {
        title: 'Attention Is All You Need',
        authors: 'Ashish Vaswani et al.',
        year: 2017,
        category: 'NLP',
        status: 'Completed',
        priority: 'High',
        notes: 'Introduced the Transformer architecture based entirely on self-attention mechanisms, replacing traditional RNNs and CNNs.'
      },
      {
        title: 'A Unified Approach to Interpreting Model Predictions',
        authors: 'Scott Lundberg, Su-In Lee',
        year: 2017,
        category: 'Explainable AI',
        status: 'Reading',
        priority: 'High',
        notes: 'Introduced SHAP (SHapley Additive exPlanations), uniting game theory with local model explanations for interpretability.'
      },
      {
        title: 'Grad-CAM: Visual Explanations from Deep Networks',
        authors: 'Ramprasaath Selvaraju et al.',
        year: 2017,
        category: 'Explainable AI',
        status: 'To Read',
        priority: 'Medium',
        notes: 'Uses gradients of any target concept flowing into the final convolutional layer to produce visual localization maps.'
      },
      {
        title: 'Deep Residual Learning for Image Recognition',
        authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
        year: 2016,
        category: 'Computer Vision',
        status: 'Completed',
        priority: 'Medium',
        notes: 'Introduced residual learning framework (ResNet) easing the training of networks that are substantially deeper.'
      },
      {
        title: 'Mastering the Game of Go with Deep Neural Networks and Tree Search',
        authors: 'David Silver et al. (AlphaGo)',
        year: 2016,
        category: 'Artificial Intelligence',
        status: 'Completed',
        priority: 'High',
        notes: 'Pioneered combining deep neural networks with Monte Carlo tree search to conquer the ancient game of Go.'
      }
    ];

    for (const paper of seedPapers) {
      insertPaperStmt.run(
        user.id,
        paper.title,
        paper.authors,
        paper.year,
        paper.category,
        paper.status,
        paper.priority,
        paper.notes
      );
    }
    console.log(`Seeded ${seedPapers.length} initial papers for user ID ${user.id}.`);
  } else {
    console.log(`User ID ${user.id} already has ${count} papers.`);
  }

  console.log('Database seeding finished successfully.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

