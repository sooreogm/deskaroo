
import { Team, User } from '@/types';
import { getCurrentUser, getUserById } from './users';
import { toast } from 'sonner';

// Mock teams data
let teams: Team[] = [
  {
    id: 'team-1',
    name: 'Engineering',
    description: 'Software engineers and developers',
    members: ['user-1'],
    createdAt: new Date(),
  },
  {
    id: 'team-2',
    name: 'Design',
    description: 'UI/UX designers',
    members: ['admin-1'],
    createdAt: new Date(),
  }
];

// Get all teams
export const getAllTeams = (): Team[] => {
  return [...teams];
};

// Get team by ID
export const getTeamById = (teamId: string): Team | undefined => {
  return teams.find(team => team.id === teamId);
};

// Get team members
export const getTeamMembers = (teamId: string): User[] => {
  const team = getTeamById(teamId);
  if (!team) return [];
  
  return team.members
    .map(userId => getUserById(userId))
    .filter((user): user is User => user !== undefined);
};

// Get user's team
export const getUserTeam = (userId: string): Team | undefined => {
  return teams.find(team => team.members.includes(userId));
};

// Get current user's team
export const getCurrentUserTeam = (): Team | undefined => {
  const currentUser = getCurrentUser();
  return getUserTeam(currentUser.id);
};

// Create a new team
export const createTeam = (name: string, description: string = ''): Team => {
  const currentUser = getCurrentUser();
  
  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name,
    description,
    members: [currentUser.id],
    createdAt: new Date(),
  };
  
  teams.push(newTeam);
  toast.success('Team created successfully');
  
  return newTeam;
};

// Add member to team
export const addTeamMember = (teamId: string, userId: string): boolean => {
  const teamIndex = teams.findIndex(team => team.id === teamId);
  
  if (teamIndex === -1) {
    toast.error('Team not found');
    return false;
  }
  
  // Check if user already in team
  if (teams[teamIndex].members.includes(userId)) {
    toast.info('User is already a member of this team');
    return false;
  }
  
  // Add user to team
  teams[teamIndex].members.push(userId);
  toast.success('Team member added successfully');
  
  return true;
};

// Remove member from team
export const removeTeamMember = (teamId: string, userId: string): boolean => {
  const teamIndex = teams.findIndex(team => team.id === teamId);
  
  if (teamIndex === -1) {
    toast.error('Team not found');
    return false;
  }
  
  // Check if user is in team
  if (!teams[teamIndex].members.includes(userId)) {
    toast.info('User is not a member of this team');
    return false;
  }
  
  // Remove user from team
  teams[teamIndex].members = teams[teamIndex].members.filter(id => id !== userId);
  toast.success('Team member removed successfully');
  
  return true;
};

// Initialize team data with mock users
export const initializeTeams = () => {
  // This function is called during app initialization to setup mock data
  // Teams are already initialized with mock data above
};
