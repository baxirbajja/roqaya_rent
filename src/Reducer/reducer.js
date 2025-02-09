 const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
};

const authReducer = (state = initialState, action = {}) => { 
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin || false,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;