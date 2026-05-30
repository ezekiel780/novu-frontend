export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  status?: string;
  isOnline: boolean;
  lastSeen: string;
  phoneNumber?: string;
  fcmToken?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: 'DM' | 'GROUP';
  name?: string;
  avatarUrl?: string;
  description?: string;
  members: ConversationMember[];
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMember {
  id: string;
  userId: string;
  conversationId: string;
  role: 'MEMBER' | 'ADMIN';
  joinedAt: string;
  leftAt?: string;
  user: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  status: 'SENT' | 'DELIVERED' | 'READ';
  replyToId?: string;
  replyTo?: Message;
  media?: Media[];
  sender: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Media {
  id: string;
  messageId?: string;
  uploadedBy: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  fileName?: string;
  createdAt: string;
}

export interface Call {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'VOICE' | 'VIDEO';
  status: 'MISSED' | 'COMPLETED' | 'DECLINED' | 'ONGOING';
  startedAt: string;
  endedAt?: string;
  duration?: number;
  caller: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
  receiver: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'NEW_MESSAGE' | 'NEW_CALL' | 'GROUP_INVITE' | 'MENTION' | 'SYSTEM';
  title: string;
  body: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ── Auth Types ────────────────────────────
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResendOtpDto {
  email: string;
  purpose: 'verification' | 'password-reset';
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

// ── API Types ─────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  path: string;
  timestamp: string;
}
