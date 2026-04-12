// ════════════════════════════════════════════════
//  StudentCare — app.js  (fixed)
// ════════════════════════════════════════════════

// ── SUBJECT CATALOGUE
const SUBJECTS = {
  CS:{
    1:['mathematics_1','physics','basic_electrical','programming_fundamentals','english'],
    2:['mathematics_2','chemistry','digital_electronics','data_structures','english_2'],
    3:['mathematics_3','computer_organization','dbms','oop_java','discrete_math'],
    4:['mathematics_4','operating_systems','computer_networks','software_engineering','microprocessors'],
    5:['theory_of_computation','computer_graphics','web_technologies','python','cn_lab'],
    6:['compiler_design','dip','iot','daa','iss','iai'],
    7:['machine_learning','cloud_computing','big_data','project_1','elective_1'],
    8:['deep_learning','blockchain','project_2','elective_2','internship']
  },
  IT:{
    1:['mathematics_1','physics','basic_electrical','programming_fundamentals','english'],
    2:['mathematics_2','chemistry','digital_electronics','data_structures','english_2'],
    3:['mathematics_3','computer_organization','dbms','oop_java','discrete_math'],
    4:['mathematics_4','operating_systems','computer_networks','software_engineering','microprocessors'],
    5:['theory_of_computation','computer_graphics','web_technologies','python','mobile_computing'],
    6:['network_security','software_testing','erp_systems','data_mining','iot','cloud_fundamentals'],
    7:['machine_learning','devops','cyber_security','project_1','elective_1'],
    8:['ai_applications','blockchain','project_2','elective_2','internship']
  },
  DS:{
    1:['mathematics_1','physics','basic_electrical','programming_fundamentals','english'],
    2:['mathematics_2','statistics_1','data_structures','python_basics','english_2'],
    3:['mathematics_3','statistics_2','dbms','data_wrangling','discrete_math'],
    4:['linear_algebra','machine_learning_1','sql_advanced','data_visualization','r_programming'],
    5:['machine_learning_2','big_data','nlp','time_series_analysis','business_analytics'],
    6:['deep_learning','data_engineering','feature_engineering','model_deployment','data_ethics','capstone_ds'],
    7:['reinforcement_learning','computer_vision','mlops','project_1','elective_1'],
    8:['advanced_ai','graph_analytics','project_2','elective_2','internship']
  },
  AI:{
    1:['mathematics_1','physics','basic_electrical','programming_fundamentals','english'],
    2:['mathematics_2','statistics_1','data_structures','python_basics','english_2'],
    3:['mathematics_3','linear_algebra','knowledge_representation','search_algorithms','discrete_math'],
    4:['machine_learning','computer_vision_1','nlp_1','probabilistic_reasoning','r_programming'],
    5:['deep_learning_1','nlp_2','robotics','reinforcement_learning','ai_ethics'],
    6:['generative_ai','computer_vision_2','autonomous_systems','ai_in_healthcare','explainable_ai','ai_project'],
    7:['llm_engineering','edge_ai','multimodal_ai','project_1','elective_1'],
    8:['advanced_deep_learning','ai_security','project_2','elective_2','internship']
  }
};

const SUBJECT_LABELS = {
  compiler_design:'Compiler Design',dip:'Digital Image Processing',iot:'Internet of Things',
  daa:'Design & Analysis of Algorithms',iss:'Info Systems Security',iai:'Introduction to AI',
  network_security:'Network Security',software_testing:'Software Testing',erp_systems:'ERP Systems',
  data_mining:'Data Mining',cloud_fundamentals:'Cloud Fundamentals',
  deep_learning:'Deep Learning',data_engineering:'Data Engineering',feature_engineering:'Feature Engineering',
  model_deployment:'Model Deployment',data_ethics:'Data Ethics',capstone_ds:'DS Capstone',
  generative_ai:'Generative AI',computer_vision_2:'Computer Vision II',autonomous_systems:'Autonomous Systems',
  ai_in_healthcare:'AI in Healthcare',explainable_ai:'Explainable AI',ai_project:'AI Project',
  mathematics_1:'Mathematics I',mathematics_2:'Mathematics II',mathematics_3:'Mathematics III',
  mathematics_4:'Mathematics IV',physics:'Physics',chemistry:'Chemistry',english:'English',english_2:'English II',
  basic_electrical:'Basic Electrical',programming_fundamentals:'Programming Fundamentals',
  digital_electronics:'Digital Electronics',data_structures:'Data Structures',oop_java:'OOP with Java',
  discrete_math:'Discrete Mathematics',computer_organization:'Computer Organization',dbms:'DBMS',
  operating_systems:'Operating Systems',computer_networks:'Computer Networks',
  software_engineering:'Software Engineering',microprocessors:'Microprocessors',
  theory_of_computation:'Theory of Computation',computer_graphics:'Computer Graphics',
  web_technologies:'Web Technologies',python:'Python',mobile_computing:'Mobile Computing',
  statistics_1:'Statistics I',statistics_2:'Statistics II',python_basics:'Python Basics',
  data_wrangling:'Data Wrangling',linear_algebra:'Linear Algebra',
  machine_learning:'Machine Learning',machine_learning_1:'ML I',machine_learning_2:'ML II',
  sql_advanced:'SQL Advanced',data_visualization:'Data Visualization',r_programming:'R Programming',
  big_data:'Big Data',nlp:'NLP',time_series_analysis:'Time Series Analysis',
  business_analytics:'Business Analytics',knowledge_representation:'Knowledge Representation',
  search_algorithms:'Search Algorithms',computer_vision_1:'Computer Vision I',nlp_1:'NLP I',nlp_2:'NLP II',
  probabilistic_reasoning:'Probabilistic Reasoning',deep_learning_1:'Deep Learning I',
  robotics:'Robotics',reinforcement_learning:'Reinforcement Learning',ai_ethics:'AI Ethics',
  cloud_computing:'Cloud Computing',devops:'DevOps',cyber_security:'Cyber Security',
  ai_applications:'AI Applications',blockchain:'Blockchain',computer_vision:'Computer Vision',
  mlops:'MLOps',advanced_ai:'Advanced AI',graph_analytics:'Graph Analytics',
  llm_engineering:'LLM Engineering',edge_ai:'Edge AI',multimodal_ai:'Multimodal AI',
  advanced_deep_learning:'Adv. Deep Learning',ai_security:'AI Security',
  project_1:'Major Project I',project_2:'Major Project II',
  elective_1:'Elective I',elective_2:'Elective II',internship:'Internship',cn_lab:'CN Lab'
};

function getSubjects(branch, sem) {
  branch = (branch||'CS').toUpperCase();
  sem = parseInt(sem)||6;
  return (SUBJECTS[branch] && SUBJECTS[branch][sem]) || SUBJECTS['CS'][6];
}
function subLabel(key) {
  return SUBJECT_LABELS[key] || key.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}

// ── STATE
let state = {
  students:[], stats:{}, branches:[],
  filter:'all', search:'', filterBranch:'', filterSem:'',
  teachers:[]
};

// Separate state for Recommendations page filters
let recState = {
  filter: 'all',
  branch: '',
  sem: '',
  search: ''
};

// ════════════════════════════════════════════════
//  BOOT
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Always show the login page first if not logged in
  if (!Auth.isLoggedIn()) {
    showAuthPage('login');
  } else {
    bootApp();
  }
});

async function bootApp() {
  showApp();
  populateTeacherInfo();
  setupNav();
  setupModal();
  setupStudentForm();
  setupFilters();
  setupSearch();
  setupRecFilters();
  setupHamburger();
  await loadDashboard();
}

// ════════════════════════════════════════════════
//  SHOW / HIDE AUTH vs APP
// ════════════════════════════════════════════════
function showAuthPage(tab) {
  document.getElementById('auth-wrap').style.display = 'grid';
  document.getElementById('app-wrap').style.display  = 'none';
  switchAuthTab(tab || 'login');
}

function showApp() {
  document.getElementById('auth-wrap').style.display = 'none';
  document.getElementById('app-wrap').style.display  = 'flex';
  // Make dashboard page active by default
  document.getElementById('page-dashboard').classList.add('active');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('login-form-wrap').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('register-form-wrap').style.display = tab === 'register' ? 'block' : 'none';
  clearAuthMessages();
}
document.querySelectorAll('.auth-tab').forEach(t =>
  t.addEventListener('click', () => switchAuthTab(t.dataset.tab)));

// ════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════
document.getElementById('login-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showAuthError('login-error','Please enter email and password.'); return; }

  setAuthBtn('login-btn', true, '⏳ Logging in...');
  clearAuthMessages();

  const res = await AuthAPI.login({ email, password });
  setAuthBtn('login-btn', false, '🔐 Login');

  if (!res) return; // network error already toasted
  if (!res.ok) { showAuthError('login-error', res.data.message || 'Login failed.'); return; }

  Auth.setSession(res.data.token, res.data.teacher);
  showToast(`Welcome, ${res.data.teacher.name}! 👋`, 'success');
  bootApp();
});

// ════════════════════════════════════════════════
//  REGISTER
// ════════════════════════════════════════════════
document.getElementById('register-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const pw  = document.getElementById('reg-password').value;
  const pw2 = document.getElementById('reg-confirm').value;
  if (pw !== pw2) { showAuthError('reg-error','Passwords do not match.'); return; }

  setAuthBtn('reg-btn', true, '⏳ Creating...');
  clearAuthMessages();

  const res = await AuthAPI.register({
    name:        document.getElementById('reg-name').value.trim(),
    email:       document.getElementById('reg-email').value.trim(),
    password:    pw,
    employee_id: document.getElementById('reg-empid').value.trim(),
    department:  document.getElementById('reg-dept').value,
    designation: document.getElementById('reg-desig').value
  });
  setAuthBtn('reg-btn', false, '✅ Create Account');

  if (!res) return;
  if (!res.ok) { showAuthError('reg-error', res.data.message || 'Registration failed.'); return; }

  showAuthSuccess('reg-success', res.data.message || 'Account created! Please login.');
  document.getElementById('register-form').reset();
  setTimeout(() => switchAuthTab('login'), 1600);
});

// ════════════════════════════════════════════════
//  LOGOUT
// ════════════════════════════════════════════════
document.getElementById('logout-btn')?.addEventListener('click', async () => {
  if (!confirm('Logout?')) return;
  await AuthAPI.logout();
  Auth.clearSession();
  resetState();
  showToast('Logged out.', 'success');
  showAuthPage('login');
});

// ════════════════════════════════════════════════
//  SIDEBAR TEACHER INFO
// ════════════════════════════════════════════════
function populateTeacherInfo() {
  const t = Auth.getTeacher();
  if (!t) return;
  setText('sidebar-teacher-name', t.name || '—');
  setText('sidebar-teacher-role', t.designation || 'Teacher');
}

// ════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════
function setupNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', async () => {
      const page = item.dataset.page;

      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const pageEl = document.getElementById('page-' + page);
      if (pageEl) pageEl.classList.add('active');

      const label = item.querySelector('.label');
      setText('topbar-title', label ? label.textContent : 'StudentCare');

      document.querySelector('.sidebar')?.classList.remove('open');

      if (page === 'analytics') {
        setTimeout(() => { renderBarChart(); renderDomainChart(); renderAttendanceChart(); }, 150);
      }
      if (page === 'teachers') loadTeachers();
      if (page === 'add-student') refreshSubjects();
    });
  });
}

function setupHamburger() {
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('open');
  });
}

// ════════════════════════════════════════════════
//  LOAD DASHBOARD DATA
// ════════════════════════════════════════════════
async function loadDashboard() {
  showLoading('Loading dashboard...');

  try {
    const [studentsRes, statsRes] = await Promise.all([
      StudentsAPI.getAll(),
      StudentsAPI.getStats()
    ]);

    if (studentsRes && studentsRes.ok) {
      state.students = studentsRes.data.students || [];
    } else {
      state.students = [];
    }

    if (statsRes && statsRes.ok) {
      state.stats    = statsRes.data.stats    || {};
      state.branches = statsRes.data.branches || [];
    } else {
      state.stats    = {};
      state.branches = [];
    }
  } catch (err) {
    console.error('loadDashboard error:', err);
    state.students = [];
    state.stats    = {};
    state.branches = [];
  }

  hideLoading();

  // Always render even if empty — shows zeros instead of blank
  renderDashboard();
  renderStudents();
  renderRecommendations();
}

// ════════════════════════════════════════════════
//  RENDER DASHBOARD
// ════════════════════════════════════════════════
function renderDashboard() {
  const s = state.stats;
  setText('stat-total',   s.total       || 0);
  setText('stat-high',    s.high_count  || 0);
  setText('stat-medium',  s.medium_count|| 0);
  setText('stat-average', s.average_count||0);
  setText('stat-classavg',(s.class_avg  || 0) + '%');
  setText('badge-students', s.total     || 0);

  // Top 5 table
  const tbody = document.getElementById('dash-table-body');
  if (tbody) {
    const top5 = [...state.students].sort((a,b) => b.composite_score - a.composite_score).slice(0,5);
    if (top5.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:30px">No students yet. Click "+ Add Student" to begin.</td></tr>`;
    } else {
      tbody.innerHTML = top5.map((s,i) => `
        <tr>
          <td>${i+1}</td>
          <td><strong>${s.name}</strong></td>
          <td style="color:var(--muted)">${s.roll_number}</td>
          <td><span class="branch-badge ${s.branch}">${s.branch}</span> <span style="color:var(--muted);font-size:11px">(${s.section})</span></td>
          <td><span class="badge blue">Sem ${s.semester}</span></td>
          <td><strong style="color:${catColor(s.category)}">${s.composite_score}%</strong></td>
          <td><span class="badge ${s.category}">${cap(s.category)}</span></td>
          <td><button class="topbar-btn" onclick="openModal(${s.id})">View</button></td>
        </tr>`).join('');
    }
  }

  // Legend
  const total = parseInt(s.total) || 1;
  setText('legend-high', `${s.high_count||0} (${pct(s.high_count,total)}%)`);
  setText('legend-mid',  `${s.medium_count||0} (${pct(s.medium_count,total)}%)`);
  setText('legend-avg',  `${s.average_count||0} (${pct(s.average_count,total)}%)`);

  renderDonutChart();
  renderBranchBreakdown();
}

function renderBranchBreakdown() {
  const c = document.getElementById('branch-breakdown');
  if (!c) return;
  const total = state.students.length || 1;
  const counts = {CS:0,IT:0,DS:0,AI:0};
  state.students.forEach(s => { if (counts[s.branch] !== undefined) counts[s.branch]++; });

  c.innerHTML = Object.entries(counts).map(([br,cnt]) => `
    <div style="background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:12px">
      <span class="branch-badge ${br}">${br}</span>
      <div style="flex:1">
        <div style="font-size:12px;margin-bottom:4px;display:flex;justify-content:space-between">
          <span>${branchName(br)}</span>
          <span style="font-family:'Syne',sans-serif;font-weight:700">${cnt}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill blue" style="width:${pct(cnt,total)}%"></div></div>
      </div>
    </div>`).join('');
}

// ════════════════════════════════════════════════
//  RENDER STUDENTS TABLE
// ════════════════════════════════════════════════
function renderStudents() {
  const c = document.getElementById('students-list');
  if (!c) return;

  let list = [...state.students];
  if (state.filter !== 'all')  list = list.filter(s => s.category === state.filter);
  if (state.filterBranch)      list = list.filter(s => s.branch   === state.filterBranch);
  if (state.filterSem)         list = list.filter(s => String(s.semester) === state.filterSem);
  if (state.search)            list = list.filter(s =>
    s.name.toLowerCase().includes(state.search) ||
    s.roll_number.toLowerCase().includes(state.search));

  if (!list.length) {
    c.innerHTML = `<div style="text-align:center;color:var(--muted);padding:50px;font-size:14px">
      No students found. ${state.students.length === 0 ? 'Add a student using "+ Add Student".' : 'Try a different filter.'}
    </div>`;
    return;
  }

  c.innerHTML = `<div class="table-wrap"><table>
    <thead><tr>
      <th>#</th><th>Name</th><th>Roll No</th><th>Branch & Sec</th>
      <th>Sem</th><th>Academic</th><th>Attendance</th><th>Score</th><th>Category</th><th>Actions</th>
    </tr></thead>
    <tbody>
      ${list.map((s,i) => `
        <tr>
          <td style="color:var(--muted)">${i+1}</td>
          <td><strong>${s.name}</strong></td>
          <td style="color:var(--muted);font-family:'Syne',sans-serif">${s.roll_number}</td>
          <td><span class="branch-badge ${s.branch}">${s.branch}</span>
              <span style="color:var(--muted);font-size:11px;margin-left:4px">(${s.section})</span></td>
          <td><span class="badge blue">Sem ${s.semester}</span></td>
          <td>
            <div style="min-width:85px">
              <div style="font-size:11px;margin-bottom:3px">${s.academic_avg}%</div>
              <div class="progress-bar"><div class="progress-fill ${s.category}" style="width:${s.academic_avg}%"></div></div>
            </div>
          </td>
          <td>
            <div style="min-width:80px">
              <div style="font-size:11px;margin-bottom:3px;color:${s.attendance>=75?'var(--green)':'var(--red)'}">${s.attendance}%</div>
              <div class="progress-bar"><div class="progress-fill ${s.attendance>=75?'blue':'average'}" style="width:${s.attendance}%"></div></div>
            </div>
          </td>
          <td><strong style="color:${catColor(s.category)};font-family:'Syne',sans-serif">${s.composite_score}%</strong></td>
          <td><span class="badge ${s.category}">${cap(s.category)}</span></td>
          <td style="display:flex;gap:5px">
            <button class="topbar-btn" onclick="openModal(${s.id})">📋 View</button>
            <button class="topbar-btn danger" onclick="deleteStudent(${s.id},'${s.name.replace(/'/g,"\\'")}')">🗑️</button>
          </td>
        </tr>`).join('')}
    </tbody>
  </table></div>`;
}

// ════════════════════════════════════════════════
//  RENDER RECOMMENDATIONS
// ════════════════════════════════════════════════
function renderRecommendations() {
  const c     = document.getElementById('rec-cards');
  const count = document.getElementById('rec-count');
  if (!c) return;

  if (!state.students.length) {
    c.innerHTML = `<div style="color:var(--muted);text-align:center;padding:50px;grid-column:1/-1">No students added yet. Add students first.</div>`;
    if (count) count.textContent = '';
    return;
  }

  // Apply rec-specific filters
  let list = [...state.students];
  if (recState.filter !== 'all') list = list.filter(s => s.category === recState.filter);
  if (recState.branch)           list = list.filter(s => s.branch === recState.branch);
  if (recState.sem)              list = list.filter(s => String(s.semester) === recState.sem);
  if (recState.search)           list = list.filter(s =>
    s.name.toLowerCase().includes(recState.search) ||
    s.roll_number.toLowerCase().includes(recState.search)
  );

  // Update count label
  if (count) {
    count.textContent = list.length === state.students.length
      ? `Showing all ${list.length} students`
      : `Showing ${list.length} of ${state.students.length} students`;
  }

  if (!list.length) {
    c.innerHTML = `<div style="color:var(--muted);text-align:center;padding:40px;grid-column:1/-1">No students match the selected filters.</div>`;
    return;
  }

  c.innerHTML = list.map(s => `
    <div class="rec-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="flex:1">
          <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700">${s.name}</div>
          <div style="font-size:13px;color:var(--muted);margin-top:2px">
            ${s.roll_number} &nbsp;·&nbsp;
            <span class="branch-badge ${s.branch}">${s.branch}</span>
            &nbsp;Sec ${s.section} &nbsp;·&nbsp; Sem ${s.semester}
          </div>
          <span class="badge ${s.category}" style="margin-top:6px;display:inline-flex">${cap(s.category)}</span>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:${catColor(s.category)}">${s.composite_score}%</div>
          <div style="font-size:12px;color:var(--muted)">Composite</div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--border);margin:10px 0">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px;font-weight:600">Recommendations</div>
      <ul class="rec-list">
        ${(s.recommendations||[]).map(r =>
          `<li>${r.icon} <span><strong>${r.type}</strong> — ${r.description}</span></li>`
        ).join('') || '<li>No recommendations generated.</li>'}
      </ul>
    </div>`).join('');
}

// ════════════════════════════════════════════════
//  FILTERS & SEARCH
// ════════════════════════════════════════════════
function setupFilters() {
  // ── STUDENTS page filters (data-filter attribute, inside #page-students)
  const studentsPage = document.getElementById('page-students');
  if (studentsPage) {
    studentsPage.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        studentsPage.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filter = btn.dataset.filter;
        renderStudents();
      });
    });
  }
  document.getElementById('filter-branch')?.addEventListener('change', e => {
    state.filterBranch = e.target.value;
    renderStudents();
  });
  document.getElementById('filter-sem')?.addEventListener('change', e => {
    state.filterSem = e.target.value;
    renderStudents();
  });
}

// ── RECOMMENDATIONS page filters (separate IDs + data-rec-filter)
function setupRecFilters() {
  const recPage = document.getElementById('page-recommendations');
  if (!recPage) return;

  // Category filter tabs (data-rec-filter)
  recPage.querySelectorAll('[data-rec-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      recPage.querySelectorAll('[data-rec-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      recState.filter = btn.dataset.recFilter;
      renderRecommendations();
    });
  });

  // Branch dropdown
  document.getElementById('rec-filter-branch')?.addEventListener('change', e => {
    recState.branch = e.target.value;
    renderRecommendations();
  });

  // Semester dropdown
  document.getElementById('rec-filter-sem')?.addEventListener('change', e => {
    recState.sem = e.target.value;
    renderRecommendations();
  });

  // Search input
  document.getElementById('rec-search')?.addEventListener('input', e => {
    recState.search = e.target.value.toLowerCase().trim();
    renderRecommendations();
  });
}

function setupSearch() {
  document.getElementById('student-search')?.addEventListener('input', e => {
    state.search = e.target.value.toLowerCase().trim();
    renderStudents();
  });
}

// ════════════════════════════════════════════════
//  ADD STUDENT FORM — dynamic subjects
// ════════════════════════════════════════════════
function refreshSubjects() {
  const branchEl  = document.getElementById('f-branch');
  const semEl     = document.getElementById('f-semester');
  const wrapEl    = document.getElementById('subjects-wrap');
  const headEl    = document.getElementById('subjects-heading');

  if (!branchEl || !semEl || !wrapEl) return;

  const branch = branchEl.value || 'CS';
  const sem    = parseInt(semEl.value) || 6;
  const subs   = getSubjects(branch, sem);

  if (headEl) headEl.textContent = `${branch} · Semester ${sem} — ${subs.length} subjects`;

  wrapEl.innerHTML = subs.map(key => `
    <div class="subject-input-card">
      <div class="sub-code">${key.toUpperCase().replace(/_/g,' ')}</div>
      <div class="sub-label">${subLabel(key)}</div>
      <input class="form-input subject-mark-input"
             data-key="${key}"
             type="number" min="0" max="100"
             placeholder="0 – 100">
    </div>`).join('');
}

function setupStudentForm() {
  // Wire branch/semester change to refresh subjects
  document.getElementById('f-branch')?.addEventListener('change', refreshSubjects);
  document.getElementById('f-semester')?.addEventListener('change', refreshSubjects);

  // Initial render of subjects
  refreshSubjects();

  // Form submit
  document.getElementById('add-student-form')?.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('f-name')?.value?.trim();
    const roll    = document.getElementById('f-roll')?.value?.trim();
    const branch  = document.getElementById('f-branch')?.value || 'CS';
    const section = document.getElementById('f-section')?.value || 'A';
    const sem     = parseInt(document.getElementById('f-semester')?.value) || 6;
    const att     = parseFloat(document.getElementById('f-att')?.value) || 0;

    if (!name || !roll) {
      showToast('Name and Roll Number are required.', 'error');
      return;
    }

    // Collect dynamic subject marks
    const marks_json = {};
    document.querySelectorAll('.subject-mark-input').forEach(inp => {
      marks_json[inp.dataset.key] = parseFloat(inp.value) || 0;
    });

    const payload = {
      name, roll_number: roll, branch, section, semester: sem,
      marks_json,
      attendance:            att,
      domain_sports:         parseFloat(document.getElementById('f-sports')?.value)  || 0,
      domain_technical:      parseFloat(document.getElementById('f-tech')?.value)    || 0,
      domain_nontech:        parseFloat(document.getElementById('f-nontech')?.value) || 0,
      domain_extracurricular:parseFloat(document.getElementById('f-extra')?.value)   || 0,
      assignments:           parseFloat(document.getElementById('f-assign')?.value)  || 0,
      projects:              parseFloat(document.getElementById('f-proj')?.value)    || 0,
      behavior:              document.getElementById('f-behavior')?.value || 'Good'
    };

    showLoading('Running AI analysis & saving to MySQL...');
    const res = await StudentsAPI.add(payload);
    hideLoading();

    if (!res) return;
    if (!res.ok) {
      showToast(res.data?.message || 'Failed to add student.', 'error');
      return;
    }

    showToast(
      `✅ ${name} added! Category: ${cap(res.data.student.category)} · Score: ${res.data.student.composite_score}%`,
      'success'
    );

    e.target.reset();
    refreshSubjects();
    await loadDashboard();

    // Navigate to students page
    document.querySelector('[data-page="students"]')?.click();
  });
}

// ════════════════════════════════════════════════
//  DELETE STUDENT
// ════════════════════════════════════════════════
async function deleteStudent(id, name) {
  if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
  showLoading('Deleting...');
  const res = await StudentsAPI.delete(id);
  hideLoading();
  if (!res?.ok) { showToast(res?.data?.message || 'Delete failed.', 'error'); return; }
  showToast(`${name} deleted.`, 'success');
  await loadDashboard();
}

// ════════════════════════════════════════════════
//  MODAL
// ════════════════════════════════════════════════
function setupModal() {
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
}

async function openModal(id) {
  showLoading('Loading student...');
  const res = await StudentsAPI.getOne(id);
  hideLoading();

  if (!res?.ok) { showToast('Could not load student details.', 'error'); return; }

  const s    = res.data.student;
  const marks = (typeof s.marks_json === 'string') ? JSON.parse(s.marks_json) : (s.marks_json || {});
  const recs  = s.recommendations || [];
  const subs  = getSubjects(s.branch, s.semester);

  document.getElementById('modal-body').innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:18px">
      <div style="flex:1">
        <h2 style="font-size:20px;margin-bottom:6px">${s.name}</h2>
        <div style="color:var(--muted);font-size:12px;margin-bottom:10px">
          ${s.roll_number} &nbsp;·&nbsp;
          <span class="branch-badge ${s.branch}">${s.branch}</span>
          Section ${s.section} &nbsp;·&nbsp; Semester ${s.semester}
          &nbsp;·&nbsp; Added by ${s.teacher_name || '—'}
        </div>
        <div style="display:flex;gap:7px;flex-wrap:wrap">
          <span class="badge ${s.category}">${cap(s.category)} Performer</span>
          <span class="badge blue">Score: ${s.composite_score}%</span>
          <span class="badge blue">Acad Avg: ${s.academic_avg}%</span>
          <span class="badge ${s.attendance>=75?'blue':'average'}">Attendance: ${s.attendance}%</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-title" style="margin-bottom:14px">📚 Subject Marks — ${branchName(s.branch)}, Sem ${s.semester}</div>
      <div class="marks-grid">
        ${subs.map(key => {
          const v   = parseFloat(marks[key]) || 0;
          const col = v >= 75 ? 'var(--green)' : v >= 50 ? 'var(--gold)' : 'var(--red)';
          return `<div class="mark-item">
            <div class="sub-name">${subLabel(key)}</div>
            <div class="sub-score" style="color:${col}">${v}<span style="font-size:11px;color:var(--muted)">/100</span></div>
            <div class="progress-bar" style="margin-top:5px">
              <div class="progress-fill blue" style="width:${v}%"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
      <div class="card" style="margin:0">
        <div class="card-title" style="margin-bottom:12px">🎯 Domain Skills</div>
        ${[['🏃 Sports',s.domain_sports],['💻 Technical',s.domain_technical],['🎨 Non-Tech',s.domain_nontech],['🎭 Extracurricular',s.domain_extracurricular]].map(([k,v])=>`
          <div style="margin-bottom:9px">
            <div class="domain-label"><span>${k}</span><span>${v}%</span></div>
            <div class="progress-bar"><div class="progress-fill blue" style="width:${v}%"></div></div>
          </div>`).join('')}
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);font-size:11px;display:flex;gap:16px">
          <div><div style="color:var(--muted)">Assignments</div><strong>${s.assignments}%</strong></div>
          <div><div style="color:var(--muted)">Projects</div><strong>${s.projects}%</strong></div>
          <div><div style="color:var(--muted)">Domain Avg</div><strong>${s.domain_avg}%</strong></div>
        </div>
      </div>
      <div class="card" style="margin:0">
        <div class="card-title" style="margin-bottom:12px">📊 Score Breakdown</div>
        ${[['Academic (40%)',s.academic_avg],['Attendance (25%)',s.attendance],['Domain (15%)',s.domain_avg],['Assignments (10%)',s.assignments],['Projects (10%)',s.projects]].map(([k,v])=>`
          <div style="margin-bottom:9px">
            <div class="domain-label"><span>${k}</span><span style="color:${catColor(s.category)}">${v}%</span></div>
            <div class="progress-bar"><div class="progress-fill ${s.category}" style="width:${v}%"></div></div>
          </div>`).join('')}
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);text-align:center">
          <div style="font-size:10px;color:var(--muted)">Overall Composite Score</div>
          <div style="font-family:'Syne',sans-serif;font-size:30px;font-weight:800;color:${catColor(s.category)}">${s.composite_score}%</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin:0">
      <div class="card-title" style="margin-bottom:12px">🤖 AI Recommendations</div>
      <ul class="rec-list">
        ${recs.length ? recs.map(r => `
          <li style="background:var(--card2);border:1px solid var(--border);border-radius:8px;padding:9px 12px;display:flex;align-items:flex-start;gap:9px">
            <span style="font-size:18px">${r.icon}</span>
            <div>
              <div style="font-weight:600;font-size:13px">${r.type}</div>
              <div style="font-size:11px;color:var(--muted)">${r.description}</div>
            </div>
          </li>`).join('')
        : '<li>No recommendations generated.</li>'}
      </ul>
    </div>`;

  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}

// ════════════════════════════════════════════════
//  TEACHERS LIST
// ════════════════════════════════════════════════
async function loadTeachers() {
  const res = await AuthAPI.getAllTeachers();
  if (!res?.ok) { showToast('Could not load teachers.', 'error'); return; }
  state.teachers = res.data.teachers || [];

  const tbody = document.getElementById('teachers-table-body');
  if (!tbody) return;

  if (!state.teachers.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:30px">No teachers registered yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.teachers.map((t,i) => `
    <tr>
      <td>${i+1}</td>
      <td>
        <div>
          <div style="font-weight:500">${t.name}</div>
          <div style="font-size:10px;color:var(--muted)">${t.email}</div>
        </div>
      </td>
      <td style="color:var(--muted)">${t.employee_id}</td>
      <td>${t.department}</td>
      <td>${t.designation}</td>
      <td><span class="badge blue">${t.student_count} students</span></td>
      <td style="font-size:11px;color:var(--muted)">${new Date(t.created_at).toLocaleDateString('en-IN')}</td>
    </tr>`).join('');

  setText('badge-teachers', state.teachers.length);
}

// ════════════════════════════════════════════════
//  CHARTS
// ════════════════════════════════════════════════
function renderDonutChart() {
  const canvas = document.getElementById('donut-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { high_count:h=0, medium_count:m=0, average_count:a=0, total:t=1 } = state.stats;
  const data = [{val:h,color:'#22d3a5'},{val:m,color:'#f5c842'},{val:a,color:'#f75f6d'}];
  const cx=90, cy=90, r=70, inner=44;
  let angle = -Math.PI/2;
  ctx.clearRect(0,0,180,180);
  const tot = h+m+a || 1;
  data.forEach(d => {
    const slice = (d.val/tot)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+slice); ctx.closePath();
    ctx.fillStyle=d.color; ctx.fill(); angle+=slice;
  });
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#131d35'; ctx.fill();
  ctx.fillStyle='#e8edf8'; ctx.font='bold 17px Syne,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(parseInt(t)||0, cx, cy-8);
  ctx.font='10px DM Sans,sans-serif'; ctx.fillStyle='#6b7fa3';
  ctx.fillText('Students', cx, cy+10);
}

function renderBarChart() {
  const canvas = document.getElementById('bar-chart');
  if (!canvas || !state.students.length) return;
  const ctx=canvas.getContext('2d'), students=state.students.slice(0,8);
  const W=canvas.width, H=canvas.height, pad={top:20,bottom:60,left:50,right:20};
  const chartW=W-pad.left-pad.right, chartH=H-pad.top-pad.bottom;
  const barW=(chartW/students.length)*0.55, gap=chartW/students.length;
  ctx.clearRect(0,0,W,H);
  [25,50,75,100].forEach(v=>{
    const y=pad.top+chartH-(v/100)*chartH;
    ctx.beginPath(); ctx.setLineDash([4,4]); ctx.strokeStyle='#1e2e50'; ctx.lineWidth=1;
    ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#6b7fa3'; ctx.font='10px DM Sans'; ctx.textAlign='right'; ctx.fillText(v+'%',pad.left-5,y+4);
  });
  students.forEach((s,i)=>{
    const x=pad.left+i*gap+gap/2-barW/2, bH=(s.composite_score/100)*chartH, y=pad.top+chartH-bH;
    const color=s.category==='high'?'#22d3a5':s.category==='medium'?'#f5c842':'#f75f6d';
    const grad=ctx.createLinearGradient(0,y,0,y+bH);
    grad.addColorStop(0,color); grad.addColorStop(1,color+'55');
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(x,y,barW,bH,[4,4,0,0]); else ctx.rect(x,y,barW,bH);
    ctx.fillStyle=grad; ctx.fill();
    ctx.fillStyle='#e8edf8'; ctx.font='bold 10px Syne'; ctx.textAlign='center';
    ctx.fillText(s.composite_score+'%',x+barW/2,y-5);
    ctx.fillStyle='#6b7fa3'; ctx.font='9px DM Sans';
    ctx.fillText(s.name.split(' ')[0],x+barW/2,pad.top+chartH+14);
  });
}

function renderDomainChart() {
  const canvas = document.getElementById('domain-chart');
  if (!canvas || !state.students.length) return;
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  const cx=W/2, cy=H/2, r=Math.min(W,H)/2-30;
  const labels=['Sports','Technical','Non-Tech','Extra'];
  const keys=['domain_sports','domain_technical','domain_nontech','domain_extracurricular'];
  const angleStep=(Math.PI*2)/labels.length;
  ctx.clearRect(0,0,W,H);
  [20,40,60,80,100].forEach(v=>{
    ctx.beginPath();
    labels.forEach((_,i)=>{const a=i*angleStep-Math.PI/2;const x=cx+Math.cos(a)*r*(v/100),y=cy+Math.sin(a)*r*(v/100);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.closePath(); ctx.strokeStyle='#1e2e50'; ctx.lineWidth=1; ctx.stroke();
  });
  labels.forEach((l,i)=>{
    const a=i*angleStep-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
    ctx.strokeStyle='#1e2e50'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#6b7fa3'; ctx.font='11px DM Sans'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(l, cx+Math.cos(a)*(r+18), cy+Math.sin(a)*(r+18));
  });
  const avg=keys.map(k=>state.students.reduce((a,s)=>a+Number(s[k]||0),0)/state.students.length);
  ctx.beginPath();
  avg.forEach((v,i)=>{const a=i*angleStep-Math.PI/2;const x=cx+Math.cos(a)*r*(v/100),y=cy+Math.sin(a)*r*(v/100);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.closePath(); ctx.fillStyle='rgba(79,142,247,.2)'; ctx.fill(); ctx.strokeStyle='#4f8ef7'; ctx.lineWidth=2; ctx.stroke();
}

function renderAttendanceChart() {
  const canvas = document.getElementById('attendance-chart');
  if (!canvas || state.students.length < 2) return;
  const ctx=canvas.getContext('2d');
  const W=canvas.clientWidth||800, H=220;
  canvas.width=W; canvas.height=H;
  const pad={top:18,bottom:55,left:48,right:18}, students=state.students;
  const chartW=W-pad.left-pad.right, chartH=H-pad.top-pad.bottom;
  const step=chartW/(students.length-1);
  ctx.clearRect(0,0,W,H);
  [60,75,85,100].forEach(v=>{
    const y=pad.top+chartH-((v-50)/50)*chartH;
    ctx.beginPath(); ctx.setLineDash([4,4]); ctx.strokeStyle='#1e2e50'; ctx.lineWidth=1;
    ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#6b7fa3'; ctx.font='10px DM Sans'; ctx.textAlign='right'; ctx.fillText(v+'%',pad.left-5,y+4);
  });
  const grad=ctx.createLinearGradient(0,pad.top,0,pad.top+chartH);
  grad.addColorStop(0,'rgba(79,142,247,.4)'); grad.addColorStop(1,'rgba(79,142,247,0)');
  ctx.beginPath();
  students.forEach((s,i)=>{const x=pad.left+i*step,y=pad.top+chartH-((Math.max(s.attendance,50)-50)/50)*chartH;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.strokeStyle='#4f8ef7'; ctx.lineWidth=2; ctx.stroke();
  ctx.lineTo(pad.left+(students.length-1)*step,pad.top+chartH); ctx.lineTo(pad.left,pad.top+chartH); ctx.closePath();
  ctx.fillStyle=grad; ctx.fill();
  students.forEach((s,i)=>{
    const x=pad.left+i*step, y=pad.top+chartH-((Math.max(s.attendance,50)-50)/50)*chartH;
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fillStyle=s.attendance<75?'#f75f6d':'#22d3a5'; ctx.fill();
    ctx.fillStyle='#6b7fa3'; ctx.font='9px DM Sans'; ctx.textAlign='center'; ctx.fillText(s.name.split(' ')[0],x,pad.top+chartH+14);
  });
}

// ════════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════════
function cap(s)         { return s ? s[0].toUpperCase()+s.slice(1) : ''; }
function catColor(c)    { return c==='high'?'var(--high)':c==='medium'?'var(--mid)':'var(--avg)'; }
function pct(n,t)       { return t ? Math.round((parseInt(n)||0)/t*100) : 0; }
function setText(id,v)  { const el=document.getElementById(id); if(el) el.textContent=v; }
function branchName(br) { return {CS:'Comp. Science',IT:'Info. Technology',DS:'Data Science',AI:'Artificial Intelligence'}[br]||br; }
function resetState()   { state={students:[],stats:{},branches:[],filter:'all',search:'',filterBranch:'',filterSem:'',teachers:[]}; }

function showAuthError(id,msg)   { const el=document.getElementById(id); if(el){el.textContent=msg;el.style.display='flex';} }
function showAuthSuccess(id,msg) { const el=document.getElementById(id); if(el){el.textContent=msg;el.style.display='flex';} }
function clearAuthMessages()     { document.querySelectorAll('.auth-error,.auth-success').forEach(el=>el.style.display='none'); }
function setAuthBtn(id,loading,text){ const el=document.getElementById(id); if(el){el.disabled=loading;el.textContent=text;} }

function showLoading(msg='Loading...') {
  const o=document.getElementById('loading-overlay');
  if(o){ o.classList.add('show'); const p=document.getElementById('loading-text'); if(p) p.textContent=msg; }
}
function hideLoading() { document.getElementById('loading-overlay')?.classList.remove('show'); }

function showToast(msg, type='success') {
  const c=document.getElementById('toast-container'); if(!c) return;
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span>${type==='success'?'✅':'❌'}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(()=>t.remove(), 4000);
}