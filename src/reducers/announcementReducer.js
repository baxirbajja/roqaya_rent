import { 
  ADD_ANNOUNCEMENT, 
  APPROVE_ANNOUNCEMENT, 
  REJECT_ANNOUNCEMENT,
  SET_ANNOUNCEMENTS,
  DELETE_ANNOUNCEMENT
} from '../actions/announcementActions';

// Had reducer kaykhdm 3la state dyal les annonces
// Kol action 3ndha traitement dyalha: izid, i3dl, imseh, w ishof les annonces

// State initial: tableau khawi dyal les annonces
const initialState = {
  announcements: [],
  loading: false,
  error: null
};

// Reducer
const announcementReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ANNOUNCEMENTS:
      // Ibdl ga3 les annonces b array jdid
      return {
        ...state,
        announcements: action.payload
      };

    case ADD_ANNOUNCEMENT:
      // Izid annonce jdida f tableau
      return {
        ...state,
        announcements: [...state.announcements, action.payload]
      };

    case APPROVE_ANNOUNCEMENT:
      // Ibdl status dyal annonce l 'approved'
      return {
        ...state,
        announcements: state.announcements.map(announcement =>
          announcement.id === action.payload.id 
            ? { ...announcement, status: 'approved', approvedAt: action.payload.approvedAt }
            : announcement
        )
      };

    case REJECT_ANNOUNCEMENT:
      // Ibdl status dyal annonce l 'rejected'
      return {
        ...state,
        announcements: state.announcements.map(announcement =>
          announcement.id === action.payload.id 
            ? { ...announcement, status: 'rejected', rejectedAt: action.payload.rejectedAt }
            : announcement
        )
      };

    case DELETE_ANNOUNCEMENT:
      // Imseh annonce mn tableau
      return {
        ...state,
        announcements: state.announcements.filter(announcement => announcement.id !== action.payload)
      };

    default:
      // Ila makanch l'action, rj3 state bla tbdil
      return state;
  }
};

export default announcementReducer;
