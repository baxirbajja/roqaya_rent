// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@saferent.com',
  password: 'admin123',
  name: 'Admin'
};

// Login action
export const login = (credentials) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      // Check for admin login
      if (credentials.email === ADMIN_CREDENTIALS.email && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: 'admin',
          isAdmin: true
        };
        
        dispatch({ 
          type: LOGIN_SUCCESS, 
          payload: adminUser
        });
        
        resolve(adminUser);
        return;
      }

      // Check for regular user login
      const user = users.find(u => u.email === credentials.email);
      
      if (user && user.password === credentials.password) {
        const userWithRole = { 
          ...user, 
          role: 'user',
          isAdmin: false 
        };
        
        dispatch({
          type: LOGIN_SUCCESS,
          payload: userWithRole
        });
        
        resolve(userWithRole);
      } else {
        reject(new Error('Email ou mot de passe incorrect'));
      }
    });
  };
};

// Register action
export const register = (userData) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if email already exists
      if (users.some(user => user.email === userData.email)) {
        reject(new Error('Cet email est déjà utilisé'));
        return;
      }

      // Check if trying to register as admin
      if (userData.email === ADMIN_CREDENTIALS.email) {
        reject(new Error('Cet email ne peut pas être utilisé'));
        return;
      }

      const newUser = {
        ...userData,
        role: 'user',
        isAdmin: false
      };

      // Add new user to storage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Dispatch success
      dispatch({
        type: REGISTER_SUCCESS,
        payload: newUser
      });

      resolve(newUser);
    });
  };
};

// Logout action
export const logout = () => ({
  type: LOGOUT
});