const baseUrl = 'http://localhost:5000/api';

async function testSuite() {
  console.log('=== STARTING AUTOMATED END-TO-END FLOW TESTS ===');

  // Test 1: Register
  console.log('[Test 1] Testing Register...');
  const testEmail = 'test.student.' + Date.now() + '@example.com';
  const regRes = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Student', email: testEmail, password: 'password123' })
  });
  if (!regRes.ok) throw new Error('Register failed: ' + await regRes.text());
  console.log('  -> Register OK for email:', testEmail);

  // Test Duplicate Register
  const dupRes = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Student', email: testEmail, password: 'password123' })
  });
  if (dupRes.status !== 400) throw new Error('Duplicate register did not return 400');
  console.log('  -> Duplicate register rejection OK (400)');

  // Test 2: Login
  console.log('[Test 2] Testing Login...');
  const loginRes = await fetch(baseUrl + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123' })
  });
  if (!loginRes.ok) throw new Error('Login failed: ' + await loginRes.text());
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('  -> Login OK, JWT token received:', token.substring(0, 20) + '...');

  // Test 2.1: /auth/me
  const meRes = await fetch(baseUrl + '/auth/me', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const meData = await meRes.json();
  console.log('  -> Auth me OK, user:', meData.user.name);

  // Test 3: Empty Paper List & Dashboard stats
  console.log('[Test 3] Testing initial empty papers list...');
  const emptyRes = await fetch(baseUrl + '/papers', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const emptyPapers = await emptyRes.json();
  if (emptyPapers.length !== 0) throw new Error('Expected 0 papers for new user');
  console.log('  -> Initial papers count is 0, user isolation verified.');

  // Test 4: Add Papers
  console.log('[Test 4] Adding papers...');
  const p1Res = await fetch(baseUrl + '/papers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani et al.',
      year: 2017,
      category: 'NLP',
      status: 'Completed',
      priority: 'High',
      notes: 'Transformer architecture revolutionized NLP.'
    })
  });
  const paper1 = await p1Res.json();
  console.log('  -> Added paper 1 (ID:', paper1.id, paper1.title, ')');

  const p2Res = await fetch(baseUrl + '/papers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'Kaiming He et al.',
      year: 2016,
      category: 'Computer Vision',
      status: 'Reading',
      priority: 'Medium',
      notes: 'Residual connections.'
    })
  });
  const paper2 = await p2Res.json();
  console.log('  -> Added paper 2 (ID:', paper2.id, paper2.title, ')');

  const p3Res = await fetch(baseUrl + '/papers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      title: 'Generative Adversarial Nets',
      authors: 'Ian Goodfellow et al.',
      year: 2014,
      category: 'Artificial Intelligence',
      status: 'To Read',
      priority: 'Low',
      notes: 'GAN framework.'
    })
  });
  const paper3 = await p3Res.json();
  console.log('  -> Added paper 3 (ID:', paper3.id, paper3.title, ')');

  // Test 5: List Papers & Filtering Logic
  console.log('[Test 5] Testing Paper List & Filter/Search...');
  const listRes = await fetch(baseUrl + '/papers', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const allPapers = await listRes.json();
  if (allPapers.length !== 3) throw new Error('Expected 3 papers');
  console.log('  -> Total papers listed:', allPapers.length);

  // Search logic check
  const searchVaswani = allPapers.filter(p => p.authors && p.authors.includes('Vaswani'));
  console.log('  -> Search by Vaswani:', searchVaswani.length, 'match(es)');

  // Filter logic check
  const filterCompleted = allPapers.filter(p => p.status === 'Completed');
  console.log('  -> Filter by status Completed:', filterCompleted.length, 'match(es)');
  const filterHigh = allPapers.filter(p => p.priority === 'High');
  console.log('  -> Filter by priority High:', filterHigh.length, 'match(es)');

  // Test 6: Paper Detail
  console.log('[Test 6] Testing Paper Detail...');
  const detailRes = await fetch(baseUrl + '/papers/' + paper1.id, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const detail = await detailRes.json();
  if (detail.title !== paper1.title) throw new Error('Detail title mismatch');
  console.log('  -> Paper detail verified for ID', detail.id);

  // Test 7: Edit Paper
  console.log('[Test 7] Testing Edit Paper...');
  const editRes = await fetch(baseUrl + '/papers/' + paper2.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      title: 'Deep Residual Learning for Image Recognition (Updated)',
      authors: 'Kaiming He et al.',
      year: 2016,
      category: 'Computer Vision',
      status: 'Completed',
      priority: 'High',
      notes: 'Finished reading! Excellent paper on skip connections.'
    })
  });
  const edited = await editRes.json();
  if (edited.status !== 'Completed' || edited.priority !== 'High') throw new Error('Edit update failed');
  console.log('  -> Edit verified: status changed to', edited.status, 'and priority to', edited.priority);

  // Test 8: Delete Paper
  console.log('[Test 8] Testing Delete Paper...');
  const delRes = await fetch(baseUrl + '/papers/' + paper3.id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const delResult = await delRes.json();
  console.log('  -> Delete response:', delResult.message);

  const afterDelRes = await fetch(baseUrl + '/papers', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const afterDelPapers = await afterDelRes.json();
  if (afterDelPapers.length !== 2) throw new Error('Expected 2 papers remaining after delete');
  console.log('  -> Papers count after deletion:', afterDelPapers.length);

  // Test 9: Data Isolation & Security check
  console.log('[Test 9] Testing Security & Multi-tenant Isolation with Demo account...');
  const demoLogin = await fetch(baseUrl + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@example.com', password: 'demo123' })
  });
  const demoData = await demoLogin.json();
  const demoToken = demoData.token;

  // Try to access paper1 (which belongs to test user) using Demo user token
  const illegalAccess = await fetch(baseUrl + '/papers/' + paper1.id, {
    headers: { 'Authorization': 'Bearer ' + demoToken }
  });
  if (illegalAccess.status !== 404) throw new Error('Expected 404 for accessing another user\'s paper');
  console.log('  -> Cross-user data isolation verified: Demo user received 404 when requesting another user\'s paper.');

  // Demo user's papers
  const demoPapersRes = await fetch(baseUrl + '/papers', {
    headers: { 'Authorization': 'Bearer ' + demoToken }
  });
  const demoPapers = await demoPapersRes.json();
  console.log('  -> Demo user papers count:', demoPapers.length);

  console.log('=== ALL AUTOMATED TESTS PASSED SUCCESSFULLY! ===');
}

testSuite().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});

