// Core Types for NGO Library Website

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipId?: string;
  membershipType: 'basic' | 'premium' | 'lifetime';
  profileImage?: string;
  joinDate: Date;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  language: 'hindi' | 'english' | 'other';
  totalCopies: number;
  availableCopies: number;
  description?: string;
  coverImage?: string;
  addedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookBorrow {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  returnDate?: Date;
  dueDate: Date;
  status: 'borrowed' | 'returned' | 'overdue';
  fine?: number;
}

export interface Content {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'event' | 'blog';
  author: string;
  publishDate: Date;
  featuredImage?: string;
  tags: string[];
  isPublished: boolean;
  eventDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  donorName: string;
  donationType: 'blood' | 'body' | 'financial';
  bloodGroup?: string;
  contactInfo: string;
  amount?: number;
  date: Date;
  isPublic: boolean;
  createdAt: Date;
}

export interface Media {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  category: string;
  eventName?: string;
  uploadDate: Date;
  description?: string;
  createdAt: Date;
}

export interface Registration {
  id: string;
  type: 'membership' | 'library-card' | 'event';
  formData: Record<string, string | number | boolean | Date>;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
  processedDate?: Date;
  processedBy?: string;
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  isActive: boolean;
  featuredImage?: string;
  createdAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: Date;
  status: 'registered' | 'attended' | 'cancelled';
}

// Form Types
export interface MembershipFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipType: 'basic' | 'premium' | 'lifetime';
  profileImage?: File;
}

export interface LibraryCardFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  idProof: File;
  profileImage?: File;
}

export interface EventRegistrationFormData {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  additionalInfo?: string;
}

export interface DonationFormData {
  donorName: string;
  donationType: 'blood' | 'body' | 'financial';
  bloodGroup?: string;
  contactInfo: string;
  amount?: number;
  isPublic: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Component Props Types
export interface HeroSliderProps {
  slides: {
    image: string;
    title: string;
    description: string;
    ctaText?: string;
    ctaLink?: string;
  }[];
}

export interface NewsTickerProps {
  news: {
    id: string;
    title: string;
    link: string;
  }[];
  speed?: number;
}

export interface GalleryProps {
  media: Media[];
  filterBy?: string;
  showFilters?: boolean;
  layout: 'grid' | 'masonry';
}

export interface SearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
  filters?: {
    label: string;
    value: string;
  }[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation Types
export interface NavigationItem {
  href: string;
  label: string;
  icon?: string;
  children?: NavigationItem[];
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Filter Types
export interface BookFilter {
  category?: string;
  language?: string;
  author?: string;
  availability?: boolean;
}

export interface ContentFilter {
  type?: 'news' | 'event' | 'blog';
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface MediaFilter {
  type?: 'image' | 'video';
  category?: string;
  eventName?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalMembers: number;
  totalBooks: number;
  borrowedBooks: number;
  upcomingEvents: number;
  recentNews: number;
  totalDonations: number;
}

export interface UserDashboardStats {
  borrowedBooks: number;
  overdueBooks: number;
  upcomingEvents: number;
  blogPosts: number;
}

// Settings Types
export interface AppSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: Record<string, string>;
  librarySettings: {
    maxBorrowDays: number;
    maxBooksPerUser: number;
    finePerDay: number;
  };
}