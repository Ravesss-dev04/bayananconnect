import { 
  pgTable, 
  text, 
  uuid, 
  varchar, 
  boolean, 
  timestamp 
} from 'drizzle-orm/pg-core';

// ==================== USERS TABLE ====================
export const users = pgTable('users', {
  // ID (auto-generated)
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  mobileNumber: varchar('mobile_number', { length: 20 }).notNull(),
  password: text('password').notNull(),
  residencyProofUrl: text('residency_proof_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== ADMINS TABLE ====================
export const admins = pgTable('admins', {
  id: varchar('id', { length: 50 }).primaryKey().default('admin-001'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== REQUESTS TABLE ====================
export const requests = pgTable('requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(), // Link to user
  type: varchar('type', { length: 100 }).notNull(), // Garbage, Pothole, etc.
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).default('Pending').notNull(), // Pending, In Progress, Resolved, Rejected
  latitude: text('latitude').notNull(), // Storing as text to avoid precision issues
  longitude: text('longitude').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== FEEDBACK TABLE ====================
export const feedback = pgTable('feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  rating: varchar('rating', { length: 10 }), // 1-5 stars if needed
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== POLLS TABLE ====================
export const polls = pgTable('polls', {
  id: uuid('id').defaultRandom().primaryKey(),
  question: text('question').notNull(),
  options: text('options').array().notNull(), 
  isActive: boolean('is_active').default(true),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== POLL VOTES TABLE ====================
export const pollVotes = pgTable('poll_votes', {
  id: uuid('id').defaultRandom().primaryKey(),
  pollId: uuid('poll_id').references(() => polls.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  optionIndex: varchar('option_index', { length: 5 }).notNull(), // Index of the selected option
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

