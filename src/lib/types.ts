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
  issuedCopies: number;
  description?: string;
  coverImage?: string;
  publisher?: string;
  publicationYear?: number;
  price?: number;
  location?: string; // Shelf location
  addedDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface BookTransaction {
  id: string;
  bookId: string;
  studentId: string;
  studentName: string;
  bookTitle: string;
  bookAuthor: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
  fine?: number;
  fineReason?: string;
  remarks?: string;
  issuedBy: string;
  returnedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  course: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  admissionDate: string;
  status: 'active' | 'inactive' | 'banned' | 'graduated';
  membershipType: 'basic' | 'premium' | 'lifetime';
  profileImage?: string;
  booksIssued: number;
  totalBooksRead: number;
  fineAmount: number;
  maxBooksAllowed: number;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
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

// Enhanced News Article interface for comprehensive management
export interface NewsArticle {
  id: string;
  title: string;
  shortDescription: string;
  content: string; // Rich text HTML content
  excerpt?: string; // Auto-generated or manual excerpt
  
  // SEO and Metadata
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  slug: string; // URL-friendly title
  
  // Categorization
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Media
  featuredImage?: string;
  featuredImageAlt?: string;
  images: string[]; // Additional images
  videoUrl?: string; // YouTube/Vimeo URL
  
  // Publishing
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate: Date;
  scheduledDate?: Date; // For scheduled posts
  isFeatured: boolean;
  isBreaking: boolean; // Breaking news
  
  // Analytics and SEO
  viewCount: number;
  shareCount: number;
  likes: number;
  readingTime: number; // Estimated reading time in minutes
  
  // Author and source
  author: string;
  authorId: string;
  source?: string; // If news is sourced from elsewhere
  
  // Organization and workflow
  approvedBy?: string;
  approvedAt?: Date;
  lastEditedBy: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// News Category interface
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  parentId?: string; // For sub-categories
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// News Tag interface
export interface NewsTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  count: number; // Number of articles with this tag
  createdAt: Date;
  updatedAt: Date;
}

// Form data interfaces for news management
export interface NewsArticleFormData {
  title: string;
  shortDescription: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featuredImage?: File | string;
  featuredImageAlt?: string;
  videoUrl?: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: Date;
  scheduledDate?: Date;
  isFeatured: boolean;
  isBreaking: boolean;
  source?: string;
}

// Media/Gallery interface
export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  date: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
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
  longDescription?: string;
  eventDate: Date;
  eventTime: string;
  endDate?: Date;
  endTime?: string;
  location: string;
  category: string;
  maxParticipants?: number;
  currentParticipants: number;
  registrationDeadline?: Date;
  isRegistrationOpen: boolean;
  isActive: boolean;
  isFeatured: boolean;
  featuredImage?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  requirements?: string[];
  agenda?: string[];
  targetAudience?: string;
  registrationFee?: number;
  venues?: string[];
  organizers?: string[];
  sponsors?: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  eventType: 'health_camp' | 'blood_donation' | 'workshop' | 'seminar' | 'cultural' | 'inauguration' | 'other';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  participantAge?: number;
  participantGender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
  emergencyPhone?: string;
  specialRequirements?: string;
  registrationDate: Date;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled' | 'no_show';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  registrationSource: 'website' | 'phone' | 'walk_in';
  createdAt: Date;
  updatedAt: Date;
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