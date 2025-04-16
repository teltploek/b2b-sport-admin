// src/lib/data/mock-data.ts

// User Roles
export enum UserRole {
  B2BSportAdmin = 'B2B Sport Admin',
  ClubAdmin = 'Club Admin',
  ClubStaff = 'Club Staff',
}

// Agreement Status
export enum AgreementStatus {
  Pending = 'Pending',
  Active = 'Active',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

// User Status
export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

// Club Status
export enum ClubStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Setup = 'Setup',
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId?: string;
  status: UserStatus;
  avatar: string;
  lastLogin?: string;
}

export interface Club {
  id: string;
  name: string;
  adminId?: string;
  createdAt: string;
  staffCount: number;
  activeAgreements: number;
  status: ClubStatus;
  abbreviation: string;
  color: string;
  logo?: string; // New property
}

export interface AgreementTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  category: string;
}

export interface Agreement {
  id: string;
  name: string;
  clubId: string;
  templateId: string;
  status: AgreementStatus;
  createdAt: string;
  validUntil: string;
  priority: 'High' | 'Normal' | 'Low';
}

export interface Order {
  id: string;
  agreementId: string;
  clubId: string;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
  completedBy?: string;
}

export interface Activity {
  id: string;
  description: string;
  timestamp: string;
  userId?: string;
  clubId?: string;
  agreementId?: string;
  orderId?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Casper Pedersen',
    email: 'casper@b2bsport.dk',
    role: UserRole.B2BSportAdmin,
    status: UserStatus.Active,
    avatar: '/faces/casper.jpg', // Updated from "CP" to an image URL
    lastLogin: 'April 16, 2025, 10:30 AM',
  },
  {
    id: 'user-002',
    name: 'Brian Frisch',
    email: 'bifr@brondby.com',
    role: UserRole.ClubAdmin,
    clubId: 'club-002',
    status: UserStatus.Active,
    avatar: '/faces/brian.jpg',
    lastLogin: 'April 16, 2025, 9:15 AM',
  },
  {
    id: 'user-003',
    name: 'Ole Andersen',
    email: 'ole@ribehk.com',
    role: UserRole.ClubAdmin,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/uifaces-01.jpg',
    lastLogin: 'April 15, 2025, 3:45 PM',
  },
  {
    id: 'user-004',
    name: 'Grethe Jensen',
    email: 'grje@efb.dk',
    role: UserRole.ClubAdmin,
    clubId: 'club-003',
    status: UserStatus.Inactive,
    avatar: '/faces/uifaces-02.jpg',
    lastLogin: 'April 10, 2025, 11:20 AM',
  },
  {
    id: 'user-005',
    name: 'Bente Larsen',
    email: 'bela@b93.dk',
    role: UserRole.ClubAdmin,
    clubId: 'club-004',
    status: UserStatus.Pending,
    avatar: '/faces/uifaces-03.jpg',
  },
  {
    id: 'user-006',
    name: 'Bjarne Pedersen',
    email: 'bjpe@ribehk.dk',
    role: UserRole.ClubStaff,
    clubId: 'club-001',
    status: UserStatus.Active,
    avatar: '/faces/uifaces-04.jpg',
    lastLogin: 'April 16, 2025, 8:45 AM',
  },
];

// Mock Clubs
export const mockClubs: Club[] = [
  {
    id: 'club-001',
    name: 'Ribe HK',
    adminId: 'user-002',
    createdAt: 'Jan 15, 2025',
    staffCount: 8,
    activeAgreements: 2,
    status: ClubStatus.Active,
    abbreviation: 'RHK',
    color: '#4a86e8',
    logo: '/clubs/ribehk.png', // Updated from "Ribe HK" to an image URL
  },
  {
    id: 'club-002',
    name: 'Brøndby IF',
    adminId: 'user-003',
    createdAt: 'Feb 20, 2025',
    staffCount: 5,
    activeAgreements: 1,
    status: ClubStatus.Active,
    abbreviation: 'BIF',
    color: '#9C27B0',
    logo: '/clubs/brondby.png', // Updated from "Brøndby IF" to an image URL
  },
  {
    id: 'club-003',
    name: 'Esbjerg fB',
    adminId: 'user-004',
    createdAt: 'Mar 5, 2025',
    staffCount: 3,
    activeAgreements: 0,
    status: ClubStatus.Inactive,
    abbreviation: 'EFB',
    color: '#FF5722',
    logo: '/clubs/efb.png', // Updated from "Esbjerg fB" to an image URL
  },
  {
    id: 'club-004',
    name: 'B93',
    createdAt: 'Apr 10, 2025',
    staffCount: 0,
    activeAgreements: 0,
    status: ClubStatus.Setup,
    abbreviation: 'B93',
    color: '#607D8B',
    logo: '/clubs/b93.png', // Updated from "B93" to an image URL
  },
];

// Mock Agreement Templates
export const mockAgreementTemplates: AgreementTemplate[] = [
  {
    id: 'template-001',
    name: '2025 Team Kit',
    description: 'Complete team uniform package including jerseys, shorts, and socks',
    createdAt: 'Apr 10, 2025',
    category: 'Uniforms',
  },
  {
    id: 'template-002',
    name: 'Training Equipment',
    description: 'Training equipment including cones, balls, and practice jerseys',
    createdAt: 'Mar 15, 2025',
    category: 'Equipment',
  },
  {
    id: 'template-003',
    name: 'Goalkeeper Specialized Kit',
    description: 'Specialized goalkeeper equipment and uniform package',
    createdAt: 'Feb 28, 2025',
    category: 'Uniforms',
  },
  {
    id: 'template-004',
    name: 'Youth Development Package',
    description: 'Youth-sized equipment and uniforms for development programs',
    createdAt: 'Jan 20, 2025',
    category: 'Youth',
  },
];

// Mock Agreements
export const mockAgreements: Agreement[] = [
  {
    id: 'AGR-001245',
    name: 'FC United 2025 Season Kit',
    clubId: 'club-001',
    templateId: 'template-001',
    status: AgreementStatus.Pending,
    createdAt: 'Apr 15, 2025',
    validUntil: 'May 15, 2025',
    priority: 'Normal',
  },
  {
    id: 'AGR-001244',
    name: 'City Soccer Training Equipment',
    clubId: 'club-002',
    templateId: 'template-002',
    status: AgreementStatus.Active,
    createdAt: 'Apr 10, 2025',
    validUntil: 'Jun 10, 2025',
    priority: 'Normal',
  },
  {
    id: 'AGR-001243',
    name: 'FC United Goalkeeper Kit',
    clubId: 'club-001',
    templateId: 'template-003',
    status: AgreementStatus.InProgress,
    createdAt: 'Apr 5, 2025',
    validUntil: 'May 5, 2025',
    priority: 'High',
  },
  {
    id: 'AGR-001242',
    name: 'City Soccer 2025 Team Kit',
    clubId: 'club-002',
    templateId: 'template-001',
    status: AgreementStatus.Completed,
    createdAt: 'Mar 20, 2025',
    validUntil: 'Apr 20, 2025',
    priority: 'High',
  },
  {
    id: 'AGR-001241',
    name: 'Metro United Youth Program',
    clubId: 'club-003',
    templateId: 'template-004',
    status: AgreementStatus.Canceled,
    createdAt: 'Mar 15, 2025',
    validUntil: 'Apr 15, 2025',
    priority: 'Low',
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-2458',
    agreementId: 'AGR-001243',
    clubId: 'club-001',
    createdAt: 'Apr 12, 2025',
    status: 'Pending',
  },
  {
    id: 'ORD-2457',
    agreementId: 'AGR-001244',
    clubId: 'club-002',
    createdAt: 'Apr 11, 2025',
    status: 'Shipped',
  },
  {
    id: 'ORD-2456',
    agreementId: 'AGR-001242',
    clubId: 'club-002',
    createdAt: 'Mar 25, 2025',
    status: 'Delivered',
    completedBy: 'user-003',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    // Remove the hard-coded club name "FC United" and let the UI prepend the real club name
    description: 'added a new staff member',
    timestamp: '10:15 AM',
    clubId: 'club-001',
  },
  {
    id: 'act-002',
    description: 'New agreement signed',
    timestamp: 'Yesterday',
    clubId: 'club-002',
    agreementId: 'AGR-001244',
  },
  {
    id: 'act-003',
    description: 'Order #2458 completed',
    timestamp: 'Yesterday',
    orderId: 'ORD-2458',
  },
  {
    id: 'act-004',
    description: 'New club admin added',
    timestamp: 'Apr 15',
    clubId: 'club-003',
    userId: 'user-004',
  },
  {
    id: 'act-005',
    description: 'Agreement template "2025 Team Kit" created',
    timestamp: 'Apr 14',
  },
  {
    id: 'act-006',
    description: 'Tom Parker assigned to "First Team" order',
    timestamp: '2 hours ago',
    userId: 'user-006',
    clubId: 'club-001',
  },
  {
    id: 'act-007',
    description: 'Training equipment order (#ORD-2457) shipped',
    timestamp: 'Yesterday',
    orderId: 'ORD-2457',
  },
];

// Helper function to get club by ID
export function getClubById(id: string): Club | undefined {
  return mockClubs.find((club) => club.id === id);
}

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

// Helper function to get template by ID
export function getTemplateById(id: string): AgreementTemplate | undefined {
  return mockAgreementTemplates.find((template) => template.id === id);
}

// Helper function to get club admin
export function getClubAdmin(clubId: string): User | undefined {
  return mockUsers.find((user) => user.clubId === clubId && user.role === UserRole.ClubAdmin);
}

// Helper function to get club staff
export function getClubStaff(clubId: string): User[] {
  return mockUsers.filter((user) => user.clubId === clubId && user.role === UserRole.ClubStaff);
}

// Helper function to get club agreements
export function getClubAgreements(clubId: string): Agreement[] {
  return mockAgreements.filter((agreement) => agreement.clubId === clubId);
}

// Helper function to get club orders
export function getClubOrders(clubId: string): Order[] {
  return mockOrders.filter((order) => order.clubId === clubId);
}

// Helper function to get club activities
export function getClubActivities(clubId: string): Activity[] {
  return mockActivities.filter((activity) => activity.clubId === clubId);
}
