import { User, ServiceRequest, Announcement, Poll } from './types';

export const demoAccounts = [
  { email: 'resident@bayanan.gov', password: '123', role: 'resident', name: 'Juan Dela Cruz' },
  { email: 'admin@bayanan.gov', password: '123', role: 'admin', name: 'Kapitan Tiago' },
];

export const mockUser: User = {
  id: 'u1',
  name: 'Juan Dela Cruz',
  email: 'resident@bayanan.gov',
  role: 'resident',
  address: 'Block 5 Lot 2, Phase 1, Bayanan, Muntinlupa',
  mobile: '09123456789',
  avatarUrl: 'https://ui-avatars.com/api/?name=Juan+Dela+Cruz'
};

export const mockRequests: ServiceRequest[] = [
  {
    id: 'BRG-00123',
    userId: 'u1',
    type: 'Pothole',
    description: 'Deep pothole near the basketball court causing traffic.',
    location: {
      lat: 14.4081,
      lng: 121.0415,
      address: 'Near Bayanan Covered Court'
    },
    urgency: 'High',
    status: 'In Progress',
    dateSubmitted: '2026-01-08T09:00:00Z',
    estimatedCompletion: '2026-01-12',
    assignedPersonnel: 'Engr. Roberto',
    images: ['https://placehold.co/600x400/333/FFF?text=Pothole'],
    timeline: [
      { date: '2026-01-08T09:00:00Z', status: 'Pending', description: 'Request received' },
      { date: '2026-01-09T10:00:00Z', status: 'In Progress', description: 'Assigned to Engineering Dept', by: 'Admin' }
    ]
  },
  {
    id: 'BRG-00124',
    userId: 'u1',
    type: 'Garbage Collection',
    description: 'Missed collection for 2 days.',
    location: {
      lat: 14.4090,
      lng: 121.0420,
      address: 'Block 5 Lot 2, Phase 1'
    },
    urgency: 'Medium',
    status: 'Pending',
    dateSubmitted: '2026-01-10T07:30:00Z',
    images: [],
    timeline: [
        { date: '2026-01-10T07:30:00Z', status: 'Pending', description: 'Request received' }
    ]
  },
  {
    id: 'BRG-00120',
    userId: 'u1',
    type: 'Broken Streetlight',
    description: 'Light flickering at corner of street.',
    location: {
      lat: 14.4085,
      lng: 121.0410,
      address: 'Main St. corner 1st Ave.'
    },
    urgency: 'Low',
    status: 'Completed',
    dateSubmitted: '2025-12-28T18:00:00Z',
    images: [],
    timeline: [
        { date: '2025-12-28T18:00:00Z', status: 'Pending', description: 'Request received' },
        { date: '2025-12-30T14:00:00Z', status: 'Completed', description: 'Bulb replaced', by: 'Maintenance' }
    ]
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Community Clean-up Drive',
    content: 'Join us this Saturday for a cleaner Bayanan! Meeting place at the Barangay Hall.',
    date: '2026-01-11',
    type: 'event'
  },
  {
    id: 'a2',
    title: 'Weather Advisory: Heavy Rain',
    content: 'Expect heavy rainfall due to tropical depression. Stay safe and dry.',
    date: '2026-01-10',
    type: 'alert'
  }
];

export const mockPolls: Poll[] = [
  {
    id: 'p1',
    question: 'Should we add more streetlights in Phase 1?',
    options: [
      { id: 'opt1', text: 'Yes, it is too dark', votes: 45 },
      { id: 'opt2', text: 'No, it is sufficient', votes: 5 }
    ]
  }
];

export const mockResources = [
    { id: 'R-001', name: 'Garbage Truck A', type: 'Vehicle', status: 'Active', assignedTo: 'Driver Mario', condition: 'Good' },
    { id: 'R-002', name: 'Garbage Truck B', type: 'Vehicle', status: 'Maintenance', assignedTo: '-', condition: 'Needs Repair' },
    { id: 'R-003', name: 'Ambulance 1', type: 'Vehicle', status: 'Active', assignedTo: 'Team Alpha', condition: 'Excellent' },
    { id: 'R-004', name: 'Patrol Car 1', type: 'Vehicle', status: 'Active', assignedTo: 'Officer Pulis', condition: 'Good' },
    { id: 'R-005', name: 'Chainsaw Kit', type: 'Equipment', status: 'Available', assignedTo: '-', condition: 'Good' },
    { id: 'R-006', name: 'Generator Set', type: 'Equipment', status: 'Deployed', assignedTo: 'Evacuation Center', condition: 'Good' },
];

export const mockPersonnel = [
    { id: 'P-001', name: 'Mario Speedwagon', role: 'Driver', department: 'Sanitation', status: 'On Duty', mobile: '0917-111-1111' },
    { id: 'P-002', name: 'Luigi Jumpman', role: 'Responder', department: 'Emergency', status: 'On Duty', mobile: '0917-222-2222' },
    { id: 'P-003', name: 'Peach Toadstool', role: 'Admin Staff', department: 'Office', status: 'Break', mobile: '0917-333-3333' },
    { id: 'P-004', name: 'Bowser Koopa', role: 'Security', department: 'Peace & Order', status: 'Off Duty', mobile: '0917-444-4444' },
];

export const mockCCTV = [
    { id: 'CAM-01', location: 'Main Gate', status: 'Online', feedUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=300&auto=format&fit=crop' },
    { id: 'CAM-02', location: 'Plaza Center', status: 'Online', feedUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=300&auto=format&fit=crop' },
    { id: 'CAM-03', location: 'Market St.', status: 'Maintenance', feedUrl: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=300&auto=format&fit=crop' },
    { id: 'CAM-04', location: 'School Zone', status: 'Online', feedUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=300&auto=format&fit=crop' },
];

export const mockInventory = [
    { id: 'INV-001', item: 'Medical Kits', quantity: 50, unit: 'box', threshold: 10, category: 'Health' },
    { id: 'INV-002', item: 'Relief Packs', quantity: 500, unit: 'pack', threshold: 100, category: 'Welfare' },
    { id: 'INV-003', item: 'Road Cones', quantity: 25, unit: 'pc', threshold: 30, category: 'Traffic' },
    { id: 'INV-004', item: 'Flashlights', quantity: 15, unit: 'pc', threshold: 20, category: 'Emergency' },
];
