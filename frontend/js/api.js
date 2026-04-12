// ── API BASE: auto-detects whether you open via Live Server or via Node server
// If opened from 127.0.0.1:5500 or localhost:5500 → backend is at :5000
// If opened from localhost:5000 (served by Node) → same origin
const _port = window.location.port;
const _host = window.location.hostname;
const API_BASE = (_port === '5500' || _port === '3000' || _port === '5173')
  ? `http://${_host}:5000/api`
  : `${window.location.origin}/api`;

console.log('[StudentCare] API_BASE =', API_BASE);

// ── TOKEN HELPERS
const Auth = {
  getToken:   () => localStorage.getItem('sc_token'),
  getTeacher: () => { try { return JSON.parse(localStorage.getItem('sc_teacher')); } catch { return null; } },
  setSession: (token, teacher) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_teacher', JSON.stringify(teacher));
  },
  clearSession: () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_teacher');
  },
  isLoggedIn: () => !!localStorage.getItem('sc_token')
};

// ── FETCH WRAPPER with proper error handling
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Handle non-JSON responses gracefully
    let data;
    try { data = await res.json(); }
    catch { data = { message: 'Server returned invalid response.' }; }

    if (res.status === 401) {
      Auth.clearSession();
      showAuthPage('login');
      if (typeof showToast === 'function') showToast('Session expired. Please login again.', 'error');
      return null;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('[API Error]', endpoint, err.message);
    if (typeof showToast === 'function') {
      showToast('❌ Cannot reach server. Make sure Node.js is running on port 5000.', 'error');
    }
    return null;
  }
}

// ── AUTH API
const AuthAPI = {
  register:       (p) => apiCall('/auth/register', 'POST', p),
  login:          (p) => apiCall('/auth/login', 'POST', p),
  logout:         ()  => apiCall('/auth/logout', 'POST'),
  getMe:          ()  => apiCall('/auth/me'),
  getAllTeachers:  ()  => apiCall('/auth/all-teachers')
};

// ── STUDENTS API
const StudentsAPI = {
  getAll:    ()       => apiCall('/students'),
  getStats:  ()       => apiCall('/students/stats'),
  getOne:    (id)     => apiCall(`/students/${id}`),
  add:       (data)   => apiCall('/students', 'POST', data),
  update:    (id, d)  => apiCall(`/students/${id}`, 'PUT', d),
  delete:    (id)     => apiCall(`/students/${id}`, 'DELETE')
};

window.Auth = Auth;
window.AuthAPI = AuthAPI;
window.StudentsAPI = StudentsAPI;
window.apiCall = apiCall;
