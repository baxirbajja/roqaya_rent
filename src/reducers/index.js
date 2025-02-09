import { combineReducers } from 'redux';
import authReducer from './authReducer';
import announcementReducer from './announcementReducer';

// Kan combiniw reducers
const rootReducer = combineReducers({
  //reducer dial authintification dial les utilistaeurs
  auth: authReducer,
  //reducer dial gestion dial les annonces
  announcements: announcementReducer
});

export default rootReducer;
