// Had reducer kaykhdm 3la authentification
// Kaydir tracking l user connecté wla la

import { LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS } from '../actions/authActions';

// State li kaybda bih: user machi connecté
const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null
};

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // User dar login b success
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin,
        user: action.payload
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: false,
        user: action.payload
      };
    // User dar logout
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isAdmin: false,
        user: null
      };
    // Ila makanch l'action, rj3 state bla tbdil
    default:
      return state;
  }
};

export default authReducer;
