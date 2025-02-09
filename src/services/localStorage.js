// Admin credentials
const ADMIN_EMAIL = 'admin@saferent.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // In a real app, this would be hashed and stored securely

// Local Storage Keys
const USER_KEY = 'user';
const USERS_KEY = 'users';

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const registerUser = (userData) => {
  const users = getAllUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === userData.email || user.username === userData.username)) {
    throw new Error('User with this email or username already exists');
  }

  // Check if trying to register with admin credentials
  if (userData.email === ADMIN_EMAIL || userData.username === ADMIN_USERNAME) {
    throw new Error('Invalid email or username');
  }

  const newUser = {
    ...userData,
    id: Date.now(),
    isAdmin: false,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const loginUser = (email, password) => {
  // Check for admin login
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      id: 'admin',
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      isAdmin: true,
    };
  }

  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export const getAllUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const isAdminUser = (user) => {
  return user && user.isAdmin;
};
