import { Announcement, AnnouncementAcknowledgment } from '@/types';
import { getCurrentUser, getUserById } from './users';
import { getTeamById, getCurrentUserTeam } from './teams';
import { toast } from 'sonner';

// Mock announcements data
let announcements: Announcement[] = [
  {
    id: 'announcement-1',
    title: 'New Office Hours',
    content: 'Starting next week, our office will be open from 8 AM to 6 PM.',
    teamId: 'team-1',
    createdBy: 'admin-1',
    createdAt: new Date(2023, 5, 15),
    important: true,
  },
  {
    id: 'announcement-2',
    title: 'Team Meeting',
    content: 'Don\'t forget our team meeting on Friday at 3 PM in the main conference room.',
    teamId: 'team-1',
    createdBy: 'user-1',
    createdAt: new Date(2023, 5, 20),
    important: false,
  },
  {
    id: 'announcement-3',
    title: 'New Project Kickoff',
    content: 'We\'re starting a new project next month. Details will be shared in the upcoming team meeting.',
    teamId: 'team-2',
    createdBy: 'admin-1',
    createdAt: new Date(2023, 6, 1),
    important: true,
  },
];

// Mock storage for acknowledgments
let acknowledgments: AnnouncementAcknowledgment[] = [];

// Get all announcements
export const getAllAnnouncements = (): Announcement[] => {
  return [...announcements];
};

// Get announcements for a specific team
export const getTeamAnnouncements = (teamId: string): Announcement[] => {
  return announcements.filter(announcement => announcement.teamId === teamId);
};

// Get announcements for the current user's team
export const getCurrentUserTeamAnnouncements = (): Announcement[] => {
  const currentUserTeam = getCurrentUserTeam();
  if (!currentUserTeam) return [];
  
  return getTeamAnnouncements(currentUserTeam.id);
};

// Get an announcement by ID
export const getAnnouncementById = (id: string): Announcement | undefined => {
  return announcements.find(announcement => announcement.id === id);
};

// Create a new announcement
export const createAnnouncement = (
  title: string, 
  content: string, 
  teamId: string, 
  important: boolean = false,
  requiresAcknowledgment: boolean = false
): Announcement => {
  const currentUser = getCurrentUser();
  const team = getTeamById(teamId);
  
  if (!team) {
    toast.error('Team not found');
    throw new Error('Team not found');
  }
  
  const newAnnouncement: Announcement = {
    id: `announcement-${Date.now()}`,
    title,
    content,
    teamId,
    createdBy: currentUser.id,
    createdAt: new Date(),
    important,
    requiresAcknowledgment,
    acknowledgments: [],
  };
  
  announcements.push(newAnnouncement);
  toast.success('Announcement created successfully');
  
  return newAnnouncement;
};

// Check if a user has acknowledged an announcement
export const hasUserAcknowledged = (announcementId: string, userId: string): boolean => {
  return acknowledgments.some(
    ack => ack.announcementId === announcementId && ack.userId === userId
  );
};

// Acknowledge an announcement
export const acknowledgeAnnouncement = (announcementId: string): void => {
  const currentUser = getCurrentUser();
  const announcement = getAnnouncementById(announcementId);
  
  if (!announcement) {
    toast.error('Announcement not found');
    return;
  }
  
  if (hasUserAcknowledged(announcementId, currentUser.id)) {
    toast.error('Announcement already acknowledged');
    return;
  }
  
  const acknowledgment: AnnouncementAcknowledgment = {
    announcementId,
    userId: currentUser.id,
    acknowledgedAt: new Date(),
  };
  
  acknowledgments.push(acknowledgment);
  toast.success('Announcement acknowledged');
};

// Update an existing announcement
export const updateAnnouncement = (
  id: string, 
  updates: Partial<Omit<Announcement, 'id' | 'createdBy' | 'createdAt'>>
): Announcement | undefined => {
  const index = announcements.findIndex(a => a.id === id);
  
  if (index === -1) {
    toast.error('Announcement not found');
    return undefined;
  }
  
  announcements[index] = {
    ...announcements[index],
    ...updates,
  };
  
  toast.success('Announcement updated successfully');
  return announcements[index];
};

// Delete an announcement
export const deleteAnnouncement = (id: string): boolean => {
  const initialLength = announcements.length;
  announcements = announcements.filter(a => a.id !== id);
  
  if (announcements.length === initialLength) {
    toast.error('Announcement not found');
    return false;
  }
  
  toast.success('Announcement deleted successfully');
  return true;
};

// Get formatted creator name for an announcement
export const getAnnouncementCreatorName = (announcement: Announcement): string => {
  const creator = getUserById(announcement.createdBy);
  return creator ? creator.name : 'Unknown User';
};

// Initialize announcements
export const initializeAnnouncements = (): void => {
  // Announcements are already initialized with mock data above
};
