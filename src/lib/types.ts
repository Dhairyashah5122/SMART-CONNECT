

export type UserRole = 'Admin' | 'Mentor' | 'Student';

// Advanced Search and Data Mining Types
export enum SearchOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  GREATER_THAN = "gt",
  GREATER_EQUAL = "gte",
  LESS_THAN = "lt",
  LESS_EQUAL = "lte",
  BETWEEN = "between",
  IN = "in",
  NOT_IN = "not_in",
  IS_NULL = "is_null",
  IS_NOT_NULL = "is_not_null",
  REGEX = "regex",
  FULL_TEXT = "full_text"
}

export enum DataType {
  STRING = "string",
  INTEGER = "integer",
  FLOAT = "float",
  BOOLEAN = "boolean",
  DATE = "date",
  DATETIME = "datetime",
  JSON = "json",
  ARRAY = "array"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

export enum ExportFormat {
  JSON = "json",
  CSV = "csv",
  EXCEL = "excel",
  PDF = "pdf",
  XML = "xml"
}

export interface FilterCondition {
  field: string;
  operator: SearchOperator;
  value: any;
  data_type: DataType;
}

export interface SortCondition {
  field: string;
  order: SortOrder;
}

export interface SearchQuery {
  entity: string;
  filters: FilterCondition[];
  search_text?: string;
  search_fields: string[];
  sort: SortCondition[];
  page: number;
  page_size: number;
  include_relations: boolean;
  aggregate_functions: Record<string, string>;
}

export interface SearchResult {
  data: Record<string, any>[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  aggregations: Record<string, any>;
  execution_time_ms: number;
  query_info: Record<string, any>;
}

export interface FilterOption {
  label: string;
  value: any;
  count?: number;
}

export interface FilterDefinition {
  field: string;
  field_type: DataType;
  display_name: string;
  operators: SearchOperator[];
  options?: FilterOption[];
  min_value?: number;
  max_value?: number;
  default_operator: SearchOperator;
}

export interface FilterGroup {
  name: string;
  display_name: string;
  filters: FilterDefinition[];
}

export interface FilterPreset {
  name: string;
  display_name: string;
  description: string;
  entity: string;
  filters: FilterCondition[];
  sort: SortCondition[];
}

export interface ExportOptions {
  format: ExportFormat;
  include_headers: boolean;
  include_metadata: boolean;
  include_relations: boolean;
  flatten_json: boolean;
  custom_filename?: string;
  template_name?: string;
  compression: boolean;
}

export interface ExportResult {
  filename: string;
  format: ExportFormat;
  size_bytes: number;
  record_count: number;
  file_data: string;
  download_url?: string;
  created_at: string;
}

// Core User Information
export type User = {
    id: string; // Corresponds to Firebase Auth UID
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    fullName: string; // Combined for display purposes
    profilePhotoUrl?: string;
    createdAt: string;
    updatedAt: string;
    studentProfile?: StudentProfile;
    mentorProfile?: MentorProfile;
};

// Profile for Students, linked to a User
export type StudentProfile = {
    studentIdNumber: string;
    gpa: number;
    program: string;
    resumeText: string;
    skills: string[];
    status: 'Pending' | 'Approved' | 'Rejected';
    ndaStatus: 'Signed' | 'Pending';
    registrationDate: string;
    milestones: Milestone[];
    projectId?: string;
    mentorId?: string;
    rejectionReason?: string;
};

// Profile for Mentors, linked to a User
export type MentorProfile = {
    skills: string[];
    pastProjects: string[];
    status: 'Active' | 'Inactive' | 'Available' | 'Not Available';
    menteeIds: string[];
};

export type Milestone = {
    id: string;
    text: string;
    status: 'pending' | 'completed';
    dueDate: string;
};

// Redefined Student to use the new User/Profile structure
export type Student = User & {
    role: 'Student';
    studentProfile: StudentProfile;
};

// Redefined Mentor to use the new User/Profile structure
export type Mentor = User & {
    role: 'Mentor';
    mentorProfile: MentorProfile;
};


export type Project = {
  id: string;
  name: string;
  company: string;
  description: string;
  finalReportUrl?: string;
  projectCharterUrl?: string;
  status: 'Ongoing' | 'Completed' | 'Not Assigned';
  studentIds: string[]; // Array of User IDs
  mentorIds: string[]; // Array of User IDs
  courseIds: string[]; // Array of Course IDs
  startDate: string;
  completionDate: string;
};

export type Survey = {
  id: string;
  title: string;
  type: 'Student Satisfaction' | 'Company Feedback' | 'Mentor Review' | 'Self-Assessment';
  status: 'Active' | 'Closed';
  responses: number;
  totalParticipants: number;
  createdAt: string;
  dueDate: string;
  lastReminderSent?: string;
};

export type SurveyResponse = {
    id: string;
    surveyId: string; // Foreign Key to Surveys.id
    userId: string; // Foreign Key to Users.id (the respondent)
    responseData: Record<string, any>; // JSON or similar flexible type
    submittedAt: string;
};

export type Company = {
  id:string;
  name: string;
  projects: Project[];
  surveyCompleted: boolean;
};

export type Course = {
  id: string;
  title: string;
  code: string;
  schedule: string;
  delivery: "online" | "in-person";
  classroom?: string;
  studentIds: string[];
  mentorId?: string; // User ID of the mentor
};

// This join table would be implicit in a NoSQL DB like Firestore
// but is good to define for clarity.
export type CourseEnrollment = {
    courseId: string;
    studentId: string; // User ID of the student
}
