/**
 * LINETECH backend domain contracts.
 *
 * IMPORTANT:
 * - These types model data only.
 * - They do not alter or restyle any frontend UI.
 * - The existing frontend remains the visual source of truth.
 */

export const projectRequestStatuses = [
  "submitted",
  "reviewing",
  "scoped",
  "accepted",
  "declined",
] as const;

export const projectStatuses = [
  "planned",
  "active",
  "waiting_client",
  "review",
  "completed",
  "archived",
] as const;

export const messageKinds = ["text", "image", "audio", "document"] as const;
export const messageSenderRoles = ["client", "company"] as const;

export const projectFileCategories = [
  "brief",
  "reference",
  "deliverable",
  "handover",
  "other",
] as const;

export type ProjectRequestStatus = (typeof projectRequestStatuses)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type MessageKind = (typeof messageKinds)[number];
export type MessageSenderRole = (typeof messageSenderRoles)[number];
export type ProjectFileCategory = (typeof projectFileCategories)[number];

export type ISODateTime = string;
export type UUID = string;

export interface ProfileRecord {
  id: UUID;
  fullName: string;
  company: string | null;
  phone: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ProjectRequestRecord {
  id: UUID;
  referenceNumber: string;
  ownerId: UUID;
  status: ProjectRequestStatus;
  name: string;
  company: string | null;
  contact: string;
  preferredContact: string;
  service: string;
  stage: string;
  goal: string;
  audience: string | null;
  idea: string;
  features: string | null;
  referenceLinks: string | null;
  budget: string | null;
  timing: string | null;
  notes: string | null;
  submittedAt: ISODateTime;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ProjectRecord {
  id: UUID;
  requestId: UUID | null;
  clientId: UUID;
  title: string;
  status: ProjectStatus;
  phase: 1 | 2 | 3 | 4 | 5;
  summary: string | null;
  latestUpdate: string | null;
  nextActionTitle: string | null;
  nextActionBody: string | null;
  nextActionRequired: boolean;
  dueDate: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ProjectActivityRecord {
  id: UUID;
  projectId: UUID;
  actorId: UUID | null;
  eventType: string;
  title: string;
  detail: string | null;
  createdAt: ISODateTime;
}

export interface ProjectFileRecord {
  id: UUID;
  projectId: UUID;
  uploaderId: UUID | null;
  category: ProjectFileCategory;
  storageBucket: string;
  storagePath: string;
  fileName: string;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: ISODateTime;
}

export interface ConversationRecord {
  id: UUID;
  projectId: UUID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface MessageRecord {
  id: UUID;
  conversationId: UUID;
  senderId: UUID;
  senderRole: MessageSenderRole;
  kind: MessageKind;
  text: string | null;
  editedAt: ISODateTime | null;
  deletedAt: ISODateTime | null;
  createdAt: ISODateTime;
}

export interface MessageAttachmentRecord {
  id: UUID;
  messageId: UUID;
  storageBucket: string;
  storagePath: string;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  durationSeconds: number | null;
  createdAt: ISODateTime;
}

export interface HandoverItemRecord {
  id: UUID;
  projectId: UUID;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface NotificationRecord {
  id: UUID;
  userId: UUID;
  projectId: UUID | null;
  title: string;
  body: string | null;
  readAt: ISODateTime | null;
  createdAt: ISODateTime;
}
