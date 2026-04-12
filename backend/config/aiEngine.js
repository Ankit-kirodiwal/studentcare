// Branch + semester subject catalogue
const SUBJECTS = {
  CS: {
    1: ['mathematics_1', 'physics', 'basic_electrical', 'programming_fundamentals', 'english'],
    2: ['mathematics_2', 'chemistry', 'digital_electronics', 'data_structures', 'english_2'],
    3: ['mathematics_3', 'computer_organization', 'dbms', 'oop_java', 'discrete_math'],
    4: ['mathematics_4', 'operating_systems', 'computer_networks', 'software_engineering', 'microprocessors'],
    5: ['theory_of_computation', 'computer_graphics', 'web_technologies', 'python', 'cn_lab'],
    6: ['compiler_design', 'dip', 'iot', 'daa', 'iss', 'iai'],
    7: ['machine_learning', 'cloud_computing', 'big_data', 'project_1', 'elective_1'],
    8: ['deep_learning', 'blockchain', 'project_2', 'elective_2', 'internship']
  },
  IT: {
    1: ['mathematics_1', 'physics', 'basic_electrical', 'programming_fundamentals', 'english'],
    2: ['mathematics_2', 'chemistry', 'digital_electronics', 'data_structures', 'english_2'],
    3: ['mathematics_3', 'computer_organization', 'dbms', 'oop_java', 'discrete_math'],
    4: ['mathematics_4', 'operating_systems', 'computer_networks', 'software_engineering', 'microprocessors'],
    5: ['theory_of_computation', 'computer_graphics', 'web_technologies', 'python', 'mobile_computing'],
    6: ['network_security', 'software_testing', 'erp_systems', 'data_mining', 'iot', 'cloud_fundamentals'],
    7: ['machine_learning', 'devops', 'cyber_security', 'project_1', 'elective_1'],
    8: ['ai_applications', 'blockchain', 'project_2', 'elective_2', 'internship']
  },
  DS: {
    1: ['mathematics_1', 'physics', 'basic_electrical', 'programming_fundamentals', 'english'],
    2: ['mathematics_2', 'statistics_1', 'data_structures', 'python_basics', 'english_2'],
    3: ['mathematics_3', 'statistics_2', 'dbms', 'data_wrangling', 'discrete_math'],
    4: ['linear_algebra', 'machine_learning_1', 'sql_advanced', 'data_visualization', 'r_programming'],
    5: ['machine_learning_2', 'big_data', 'nlp', 'time_series_analysis', 'business_analytics'],
    6: ['deep_learning', 'data_engineering', 'feature_engineering', 'model_deployment', 'data_ethics', 'capstone_ds'],
    7: ['reinforcement_learning', 'computer_vision', 'mlops', 'project_1', 'elective_1'],
    8: ['advanced_ai', 'graph_analytics', 'project_2', 'elective_2', 'internship']
  },
  AI: {
    1: ['mathematics_1', 'physics', 'basic_electrical', 'programming_fundamentals', 'english'],
    2: ['mathematics_2', 'statistics_1', 'data_structures', 'python_basics', 'english_2'],
    3: ['mathematics_3', 'linear_algebra', 'knowledge_representation', 'search_algorithms', 'discrete_math'],
    4: ['machine_learning', 'computer_vision_1', 'nlp_1', 'probabilistic_reasoning', 'r_programming'],
    5: ['deep_learning_1', 'nlp_2', 'robotics', 'reinforcement_learning', 'ai_ethics'],
    6: ['generative_ai', 'computer_vision_2', 'autonomous_systems', 'ai_in_healthcare', 'explainable_ai', 'ai_project'],
    7: ['llm_engineering', 'edge_ai', 'multimodal_ai', 'project_1', 'elective_1'],
    8: ['advanced_deep_learning', 'ai_security', 'project_2', 'elective_2', 'internship']
  }
};

const SUBJECT_LABELS = {
  compiler_design: 'Compiler Design',
  dip: 'Digital Image Processing',
  iot: 'Internet of Things',
  daa: 'Design & Analysis of Algorithms',
  iss: 'Info Systems Security',
  iai: 'Introduction to AI',
  network_security: 'Network Security',
  software_testing: 'Software Testing',
  erp_systems: 'ERP Systems',
  data_mining: 'Data Mining',
  cloud_fundamentals: 'Cloud Fundamentals',
  deep_learning: 'Deep Learning',
  data_engineering: 'Data Engineering',
  feature_engineering: 'Feature Engineering',
  model_deployment: 'Model Deployment',
  data_ethics: 'Data Ethics',
  capstone_ds: 'DS Capstone',
  generative_ai: 'Generative AI',
  computer_vision_2: 'Computer Vision II',
  autonomous_systems: 'Autonomous Systems',
  ai_in_healthcare: 'AI in Healthcare',
  explainable_ai: 'Explainable AI',
  ai_project: 'AI Project',
  mathematics_1: 'Mathematics I',
  mathematics_2: 'Mathematics II',
  mathematics_3: 'Mathematics III',
  mathematics_4: 'Mathematics IV',
  physics: 'Physics',
  chemistry: 'Chemistry',
  english: 'English',
  english_2: 'English II',
  basic_electrical: 'Basic Electrical',
  programming_fundamentals: 'Programming Fundamentals',
  digital_electronics: 'Digital Electronics',
  data_structures: 'Data Structures',
  oop_java: 'OOP with Java',
  discrete_math: 'Discrete Mathematics',
  computer_organization: 'Computer Organization',
  dbms: 'DBMS',
  operating_systems: 'Operating Systems',
  computer_networks: 'Computer Networks',
  software_engineering: 'Software Engineering',
  microprocessors: 'Microprocessors',
  theory_of_computation: 'Theory of Computation',
  computer_graphics: 'Computer Graphics',
  web_technologies: 'Web Technologies',
  python: 'Python',
  mobile_computing: 'Mobile Computing',
  statistics_1: 'Statistics I',
  statistics_2: 'Statistics II',
  python_basics: 'Python Basics',
  data_wrangling: 'Data Wrangling',
  linear_algebra: 'Linear Algebra',
  machine_learning: 'Machine Learning',
  machine_learning_1: 'Machine Learning I',
  machine_learning_2: 'Machine Learning II',
  sql_advanced: 'SQL Advanced',
  data_visualization: 'Data Visualization',
  r_programming: 'R Programming',
  big_data: 'Big Data',
  nlp: 'NLP',
  time_series_analysis: 'Time Series Analysis',
  business_analytics: 'Business Analytics',
  knowledge_representation: 'Knowledge Representation',
  search_algorithms: 'Search Algorithms',
  computer_vision_1: 'Computer Vision I',
  nlp_1: 'NLP I',
  nlp_2: 'NLP II',
  probabilistic_reasoning: 'Probabilistic Reasoning',
  deep_learning_1: 'Deep Learning I',
  robotics: 'Robotics',
  reinforcement_learning: 'Reinforcement Learning',
  ai_ethics: 'AI Ethics',
  cloud_computing: 'Cloud Computing',
  devops: 'DevOps',
  cyber_security: 'Cyber Security',
  ai_applications: 'AI Applications',
  blockchain: 'Blockchain',
  computer_vision: 'Computer Vision',
  mlops: 'MLOps',
  advanced_ai: 'Adv. AI',
  graph_analytics: 'Graph Analytics',
  llm_engineering: 'LLM Engineering',
  edge_ai: 'Edge AI',
  multimodal_ai: 'Multimodal AI',
  advanced_deep_learning: 'Advanced Deep Learning',
  ai_security: 'AI Security',
  project_1: 'Major Project I',
  project_2: 'Major Project II',
  elective_1: 'Elective I',
  elective_2: 'Elective II',
  internship: 'Internship',
  cn_lab: 'CN Lab'
};

function getSubjects(branch, semester) {
  const normalizedBranch = (branch || 'CS').toUpperCase();
  const normalizedSemester = parseInt(semester, 10) || 6;
  return (SUBJECTS[normalizedBranch] && SUBJECTS[normalizedBranch][normalizedSemester]) || SUBJECTS.CS[6];
}

function getSubjectLabel(key) {
  return SUBJECT_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function academicAvg(marksJson) {
  const values = Object.values(marksJson || {}).map(Number).filter((v) => !Number.isNaN(v));
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function domainAvg(student) {
  return (
    [student.domain_sports, student.domain_technical, student.domain_nontech, student.domain_extracurricular]
      .map(Number)
      .reduce((sum, v) => sum + v, 0)
  ) / 4;
}

function compositeScore(student, acad, dom) {
  return (
    acad * 0.4 +
    Number(student.attendance) * 0.25 +
    dom * 0.15 +
    Number(student.assignments) * 0.1 +
    Number(student.projects) * 0.1
  );
}

function categorize(score) {
  if (score >= 80) return 'high';
  if (score >= 65) return 'medium';
  return 'average';
}

function generateRecommendations(student, acad, dom, category) {
  const recs = [];
  const dt = Number(student.domain_technical);
  const ds = Number(student.domain_sports);
  const dn = Number(student.domain_nontech);
  const de = Number(student.domain_extracurricular);

  if (acad < 60) recs.push({ type: 'Extra Classes', icon: '📚', description: 'Remedial sessions for weak subjects' });
  if (acad >= 60 && acad < 75) recs.push({ type: 'Academic Counselling', icon: '🎯', description: 'Goal-setting and personalised study plans' });
  if (acad >= 85) recs.push({ type: 'Advanced Research Projects', icon: '🔬', description: 'Research programmes or innovation challenges' });
  if (Number(student.attendance) < 70) recs.push({ type: 'Attendance Counselling', icon: '📅', description: 'Investigate attendance issues and create plan' });
  if (dt >= 80) recs.push({ type: 'Hackathons & Competitions', icon: '💻', description: 'Coding contests and technical hackathons' });
  if (dt < 55) recs.push({ type: 'Technical Training & Hands-on Practice', icon: '🛠️', description: 'Lab workshops and practical programming' });
  if (ds >= 80) recs.push({ type: 'Sports Development Programme', icon: '🏃', description: 'Inter-college sports representation' });
  if (dn >= 80) recs.push({ type: 'Soft Skills & Leadership Workshop', icon: '🎙️', description: 'Communication and leadership training' });
  if (de >= 80) recs.push({ type: 'Cultural Leadership Role', icon: '🎭', description: 'Lead college events and student committees' });
  if (category === 'high') recs.push({ type: 'Peer Mentoring Role', icon: '🌟', description: 'Guide junior and struggling students' });
  if (category === 'medium') recs.push({ type: 'One-on-One Mentoring', icon: '🤝', description: 'Regular mentor check-ins and guidance' });
  if (category !== 'high' || dt < 70) recs.push({ type: 'MOOC / Online Courses', icon: '🌐', description: 'Coursera, NPTEL, or edX certified courses' });

  const seen = new Set();
  return recs.filter((r) => {
    if (seen.has(r.type)) return false;
    seen.add(r.type);
    return true;
  }).slice(0, 5);
}

function analyzeStudent(studentData) {
  const marks = typeof studentData.marks_json === 'string'
    ? JSON.parse(studentData.marks_json)
    : (studentData.marks_json || {});

  const acad = parseFloat(academicAvg(marks).toFixed(2));
  const dom = parseFloat(domainAvg(studentData).toFixed(2));
  const score = parseFloat(compositeScore(studentData, acad, dom).toFixed(2));
  const category = categorize(score);
  const recommendations = generateRecommendations(studentData, acad, dom, category);

  return {
    academic_avg: acad,
    domain_avg: dom,
    composite_score: score,
    category,
    recommendations
  };
}

module.exports = { analyzeStudent, getSubjects, getSubjectLabel, SUBJECTS, SUBJECT_LABELS };
