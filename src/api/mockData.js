export const mockUser = {
  id: 'STU001',
  name: 'Anshu Student',
  email: 'student@proedge.com',
  role: 'STUDENT',
  avatar: 'https://ui-avatars.com/api/?name=Anshu+Student&background=random',
  enrolledCourses: ['COURSE001', 'COURSE002']
};

export const mockCourses = [
  {
    id: 'COURSE001',
    title: 'Full Stack Web Development',
    slug: 'full-stack-web-development',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Master the MERN stack and build modern web applications.',
    instructor: 'John Doe',
    progress: 45,
    totalLessons: 120,
    completedLessons: 54
  },
  {
    id: 'COURSE002',
    title: 'Data Science Bootcamp',
    slug: 'data-science-bootcamp',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Learn Python, Pandas, and Machine Learning from scratch.',
    instructor: 'Jane Smith',
    progress: 10,
    totalLessons: 80,
    completedLessons: 8
  },
  {
    id: 'COURSE003',
    title: 'UI/UX Design Masterclass',
    slug: 'ui-ux-design-masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Design beautiful user interfaces and experiences.',
    instructor: 'Alice Johnson',
    progress: 0,
    totalLessons: 60,
    completedLessons: 0
  }
];

export const mockModules = {
  'COURSE001': [
    { id: 'MOD001', title: 'Introduction to Web Dev', order: 1 },
    { id: 'MOD002', title: 'HTML & CSS Basics', order: 2 },
    { id: 'MOD003', title: 'JavaScript Fundamentals', order: 3 },
    { id: 'MOD004', title: 'React JS', order: 4 }
  ],
  'COURSE002': [
    { id: 'MOD005', title: 'Python Basics', order: 1 },
    { id: 'MOD006', title: 'Data Analysis with Pandas', order: 2 }
  ]
};

export const mockLessons = {
  'MOD001': [
    { id: 'LES001', title: 'Welcome to the Course', duration: 300, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', isCompleted: true },
    { id: 'LES002', title: 'How the Web Works', duration: 600, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', isCompleted: true }
  ],
  'MOD002': [
    { id: 'LES003', title: 'HTML Structure', duration: 900, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', isCompleted: false },
    { id: 'LES004', title: 'CSS Styling', duration: 1200, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', isCompleted: false }
  ],
  'MOD003': [
    { id: 'LES005', title: 'Variables & Data Types', duration: 800, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', isCompleted: false }
  ]
};

export const mockNotifications = [
  { id: 'NOT001', title: 'New Course Added', message: 'Check out the new UI/UX course!', read: false, date: '2024-11-26' },
  { id: 'NOT002', title: 'Assignment Due', message: 'Your assignment for HTML is due tomorrow.', read: true, date: '2024-11-25' }
];

export const mockAttendance = [
  { date: '2024-11-01', status: 'Present' },
  { date: '2024-11-02', status: 'Present' },
  { date: '2024-11-03', status: 'Absent' },
  { date: '2024-11-04', status: 'Present' },
  { date: '2024-11-05', status: 'Present' }
];
