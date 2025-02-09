import { 
  ADD_ANNOUNCEMENT, 
  APPROVE_ANNOUNCEMENT, 
  REJECT_ANNOUNCEMENT,
  SET_ANNOUNCEMENTS,
  DELETE_ANNOUNCEMENT
} from '../actions/announcementActions';

// Initial state
const initialState = {
  announcements: [],
  loading: false,
  error: null
};

// Reducer
const announcementReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload
      };

    case ADD_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [...state.announcements, action.payload]
      };

    case APPROVE_ANNOUNCEMENT:
      return {
        ...state,
        announcements: state.announcements.map(announcement =>
          announcement.id === action.payload.id 
            ? { ...announcement, status: 'approved', approvedAt: action.payload.approvedAt }
            : announcement
        )
      };

    case REJECT_ANNOUNCEMENT:
      return {
        ...state,
        announcements: state.announcements.map(announcement =>
          announcement.id === action.payload.id 
            ? { ...announcement, status: 'rejected', rejectedAt: action.payload.rejectedAt }
            : announcement
        )
      };

    case DELETE_ANNOUNCEMENT:
      return {
        ...state,
        announcements: state.announcements.filter(announcement => announcement.id !== action.payload)
      };

    default:
      return state;
  }
};

export default announcementReducer;
