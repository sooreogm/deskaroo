
import { Message, User } from '@/types';
import { getCurrentUser, getUserById } from './users';

// Mock messages data
const messages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    recipientId: 'admin-1',
    subject: 'Question about desk booking',
    content: 'Hi, I was wondering if I could book a standing desk for the entire week?',
    read: false,
    starred: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    id: 'msg-2',
    senderId: 'user-3',
    recipientId: 'admin-1',
    subject: 'Team meeting room request',
    content: 'Could we reserve the conference room for our team meeting on Friday?',
    read: true,
    starred: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },
  {
    id: 'msg-3',
    senderId: 'admin-2',
    recipientId: 'admin-1',
    subject: 'New floor plan review',
    content: 'Please review the new floor plan I created for the east wing.',
    read: true,
    starred: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) // 1 day ago
  },
  {
    id: 'msg-4',
    senderId: 'admin-1',
    recipientId: 'user-4',
    subject: 'Your booking request',
    content: 'I have approved your booking request for next Monday.',
    read: false,
    starred: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  }
];

// Get all messages for the current user (inbox)
export const getCurrentUserInbox = (): Message[] => {
  const currentUser = getCurrentUser();
  return messages.filter(message => message.recipientId === currentUser.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by date, newest first
};

// Get all messages sent by the current user (sent items)
export const getCurrentUserSentMessages = (): Message[] => {
  const currentUser = getCurrentUser();
  return messages.filter(message => message.senderId === currentUser.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by date, newest first
};

// Get unread messages for the current user
export const getUnreadMessages = (): Message[] => {
  return getCurrentUserInbox().filter(message => !message.read);
};

// Get starred messages for the current user
export const getStarredMessages = (): Message[] => {
  const currentUser = getCurrentUser();
  return messages.filter(
    message => (message.recipientId === currentUser.id || message.senderId === currentUser.id) && message.starred
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Get message by ID
export const getMessageById = (id: string): Message | undefined => {
  return messages.find(message => message.id === id);
};

// Send a new message
export const sendMessage = (
  recipientId: string, 
  subject: string, 
  content: string
): Message => {
  const currentUser = getCurrentUser();
  const newMessage: Message = {
    id: `msg-${messages.length + 1}`,
    senderId: currentUser.id,
    recipientId,
    subject,
    content,
    read: false,
    starred: false,
    createdAt: new Date()
  };
  
  messages.push(newMessage);
  return newMessage;
};

// Mark a message as read
export const markMessageAsRead = (id: string): Message | undefined => {
  const messageIndex = messages.findIndex(message => message.id === id);
  if (messageIndex !== -1) {
    messages[messageIndex].read = true;
    return messages[messageIndex];
  }
  return undefined;
};

// Toggle the starred status of a message
export const toggleMessageStarred = (id: string): Message | undefined => {
  const messageIndex = messages.findIndex(message => message.id === id);
  if (messageIndex !== -1) {
    messages[messageIndex].starred = !messages[messageIndex].starred;
    return messages[messageIndex];
  }
  return undefined;
};

// Delete a message by ID
export const deleteMessage = (id: string): boolean => {
  const messageIndex = messages.findIndex(message => message.id === id);
  if (messageIndex !== -1) {
    messages.splice(messageIndex, 1);
    return true;
  }
  return false;
};

// Get user info for a message (sender or recipient)
export const getMessageSender = (message: Message): User | undefined => {
  return getUserById(message.senderId);
};

// Get the number of unread messages for the current user
export const getUnreadMessageCount = (): number => {
  return getUnreadMessages().length;
};

// Initialize more messages for demo
export const initializeMessages = () => {
  // Add more messages if needed
};

initializeMessages();

