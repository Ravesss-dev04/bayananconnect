export type UserRole = 'resident' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  mobile?: string;
  avatarUrl?: string;
}

export type RequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type UrgencyLevel = 'Low' | 'Medium' | 'High';

export interface RequestTimelineEvent {
  date: string;
  status: RequestStatus;
  description: string;
  by?: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  type: string; // e.g., 'Garbage', 'Streetlight', 'Pothole'
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  urgency: UrgencyLevel;
  status: RequestStatus;
  dateSubmitted: string;
  estimatedCompletion?: string;
  assignedPersonnel?: string;
  images: string[];
  timeline: RequestTimelineEvent[];
  updates?: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  role: 'resident' | 'admin' | 'system';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'event' | 'alert' | 'news';
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  endDate?: string;
  userVoted?: string; // optionId if voted
}
