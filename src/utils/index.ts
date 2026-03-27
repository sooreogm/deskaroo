
// Import all utility functions and re-export them
import { createRoom, deleteRoom, getRooms, getRoomById, updateRoom } from './rooms';
import { createDesk, deleteDesk, deleteDesksByRoom, getDesks, getDeskById, updateDesk } from './desks';
import { 
  getAllBookings,
  getBookingById,
  getBookingForDeskAndUserOnDate,
  getBookingsByDate, 
  getBookingsByUser, 
  createBooking, 
  updateBookingStatus,
  updateBooking, 
  cancelBooking, 
  initializeBookings,
  isDeskAvailable 
} from './bookings';
import { 
  notifyDeskAvailable, 
  getUserNotifications, 
  markNotificationAsRead, 
  initializeNotifications,
  notifyTeamBooking 
} from './notifications';
import { generateTimeSlots } from './timeSlots';
import { 
  getCurrentUser, 
  getUserById, 
  getAllUsers, 
  getCurrentUserTeamMembers,
  getUserTeamMembers 
} from './users';
import { 
  getAllTeams, 
  getTeamById, 
  getUserTeam, 
  getCurrentUserTeam,
  getTeamMembers,
  createTeam,
  addTeamMember,
  removeTeamMember,
  initializeTeams 
} from './teams';
import { getBookingTimeDisplay } from './bookingHelpers';
import {
  getAllFloorPlans,
  getFloorPlanById,
  getFloorPlansByRoomId,
  createFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
  addObjectToFloorPlan,
  updateFloorPlanObject,
  removeObjectFromFloorPlan,
  initializeFloorPlans
} from './floorPlans';
import {
  getAllAnnouncements,
  getTeamAnnouncements,
  getCurrentUserTeamAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementCreatorName,
  initializeAnnouncements
} from './announcements';
import {
  getCurrentUserInbox,
  getCurrentUserSentMessages,
  getUnreadMessages,
  getStarredMessages,
  getMessageById,
  sendMessage,
  markMessageAsRead,
  toggleMessageStarred,
  deleteMessage,
  getMessageSender,
  getUnreadMessageCount,
  initializeMessages
} from './messages';

// Initialize mock data
export const initializeMockData = () => {
  initializeBookings();
  initializeNotifications();
  initializeTeams();
  initializeFloorPlans();
  initializeAnnouncements();
  initializeMessages();
};

// Initialize the mock data immediately
initializeMockData();

// Export all functions
export {
  // Room utilities
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  
  // Desk utilities
  getDesks,
  getDeskById,
  createDesk,
  updateDesk,
  deleteDesk,
  deleteDesksByRoom,
  
  // Booking utilities
  getAllBookings,
  getBookingById,
  getBookingForDeskAndUserOnDate,
  getBookingsByDate,
  getBookingsByUser,
  isDeskAvailable,
  createBooking,
  updateBookingStatus,
  updateBooking,
  cancelBooking,
  
  // Notification utilities
  notifyDeskAvailable,
  notifyTeamBooking,
  getUserNotifications,
  markNotificationAsRead,
  
  // Time slot utilities
  generateTimeSlots,
  
  // User utilities
  getCurrentUser,
  getUserById,
  getAllUsers,
  getCurrentUserTeamMembers,
  getUserTeamMembers,
  
  // Team utilities
  getAllTeams,
  getTeamById,
  getUserTeam,
  getCurrentUserTeam,
  getTeamMembers,
  createTeam,
  addTeamMember,
  removeTeamMember,
  
  // Floor plan utilities
  getAllFloorPlans,
  getFloorPlanById,
  getFloorPlansByRoomId,
  createFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
  addObjectToFloorPlan,
  updateFloorPlanObject,
  removeObjectFromFloorPlan,
  
  // Booking helper utilities
  getBookingTimeDisplay,
  
  // Announcement utilities
  getAllAnnouncements,
  getTeamAnnouncements,
  getCurrentUserTeamAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementCreatorName,
  
  // Message utilities
  getCurrentUserInbox,
  getCurrentUserSentMessages,
  getUnreadMessages,
  getStarredMessages,
  getMessageById,
  sendMessage,
  markMessageAsRead,
  toggleMessageStarred,
  deleteMessage,
  getMessageSender,
  getUnreadMessageCount
};
