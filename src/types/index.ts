export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  department?: string;
  role?: 'user' | 'admin';
  teamId?: string; // New field to associate users with teams
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[]; // Array of user IDs
  createdAt: Date;
}

export interface RoomUtility {
  type: 'wifi' | 'projector' | 'whiteboard' | 'conferencePhone' | 'airConditioner' | 'naturalLight';
  available: boolean;
}

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  utilities?: RoomUtility[];
}

export interface DeskUtility {
  type: 'monitor' | 'dockingStation' | 'charger' | 'adjustableHeight' | 'ergonomicChair' | 'headsetHook';
  available: boolean;
  quantity?: number;
}

export interface Desk {
  id: string;
  name: string;
  roomId: string;
  status: 'available' | 'booked' | 'maintenance';
  position: {
    x: number;
    y: number;
  };
  // New fields for the floor plan editor
  width?: number;
  height?: number;
  type?: 'standard' | 'standing' | 'corner' | 'huddle';
  rotation?: number;
  utilities?: DeskUtility[];
}

export type BookingDuration = 'full-day' | 'morning' | 'afternoon' | 'custom';

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface Booking {
  id: string;
  userId: string;
  deskId: string;
  roomId: string;
  date: Date;
  duration: BookingDuration;
  timeSlot?: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out';
  createdAt: Date;
  updatedAt: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  deskName?: string;
  roomName?: string;
  userName?: string;
  userEmail?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: 'desk_available' | 'booking_reminder' | 'booking_cancelled' | 'system' | 'team_booking'; // Added team_booking type
  actionUrl?: string;
  relatedUserId?: string; // Added field to store the ID of the user who triggered the notification
  relatedBookingId?: string; // Added field to reference the related booking
}

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// New announcement type for team updates
export interface Announcement {
  id: string;
  title: string;
  content: string;
  teamId: string;
  createdBy: string;
  createdAt: Date;
  important: boolean;
}

// New types for floor plan editor
export interface FloorPlanObject {
  id: string;
  type: 'desk' | 'wall' | 'door' | 'window' | 'plant' | 'other';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties?: Record<string, any>;
}

export interface FloorPlan {
  id: string;
  roomId: string;
  name: string;
  width: number;
  height: number;
  objects: FloorPlanObject[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// New interface for user messages
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  read: boolean;
  starred: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CommunitySpaceSummary {
  id: string;
  slug: string;
  name: string;
  description?: string;
  memberCount: number;
  messageCount: number;
}

export interface CommunitySpaceMembership {
  id: string;
  spaceId: string;
  userId: string;
  joinedAt: Date;
  lastReadAt?: Date;
}

export interface CommunityMessage {
  id: string;
  spaceId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isCurrentUser: boolean;
  attachments: Array<{
    id: string;
    kind: 'file' | 'voice_note';
    fileName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    department?: string;
  };
}

export interface CommunitySnapshot {
  space: CommunitySpaceSummary;
  membership: CommunitySpaceMembership | null;
  requiresAvatar: boolean;
  messages: CommunityMessage[];
}

export interface AnnouncementAcknowledgment {
  announcementId: string;
  userId: string;
  acknowledgedAt: Date;
}

// Update the Announcement interface to include acknowledgments
export interface Announcement {
  id: string;
  title: string;
  content: string;
  teamId: string;
  createdBy: string;
  createdAt: Date;
  important: boolean;
  acknowledgments?: AnnouncementAcknowledgment[];
  requiresAcknowledgment?: boolean;
}
