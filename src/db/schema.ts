import {
  mysqlTable,
  int,
  varchar,
  text,
  longtext,
  boolean,
  timestamp,
  mysqlEnum,
  json,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// -------------------------------------------------------------
// Administrators Table
// -------------------------------------------------------------
export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const adminsRelations = relations(admins, ({ many }) => ({
  posts: many(blogPosts),
  mediaFiles: many(mediaFiles),
}));

// -------------------------------------------------------------
// Blog Categories Table
// -------------------------------------------------------------
export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

// -------------------------------------------------------------
// Blog Posts Table
// -------------------------------------------------------------
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: longtext("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  categoryId: int("category_id").references(() => blogCategories.id, {
    onDelete: "set null",
  }),
  authorId: int("author_id").references(() => admins.id, {
    onDelete: "set null",
  }),
  authorName: varchar("author_name", { length: 100 }).default("Royal Chauffeur UAE"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  readTime: varchar("read_time", { length: 50 }).default("5 min read"),
  viewsCount: int("views_count").default(0).notNull(),
  keyTakeaways: text("key_takeaways"), // JSON array or newline bullet points
  faqs: json("faqs").$type<Array<{ question: string; answer: string }>>(), // FAQ items
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaKeywords: varchar("meta_keywords", { length: 255 }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  author: one(admins, {
    fields: [blogPosts.authorId],
    references: [admins.id],
  }),
  tags: many(blogPostTags),
}));

// -------------------------------------------------------------
// Blog Tags Table
// -------------------------------------------------------------
export const blogTags = mysqlTable("blog_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
});

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  posts: many(blogPostTags),
}));

// -------------------------------------------------------------
// Blog Post Tags (Many-to-Many join table)
// -------------------------------------------------------------
export const blogPostTags = mysqlTable(
  "blog_post_tags",
  {
    postId: int("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: int("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })]
);

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));

// -------------------------------------------------------------
// Media Files Table
// -------------------------------------------------------------
export const mediaFiles = mysqlTable("media_files", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: int("file_size").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  uploaderId: int("uploader_id").references(() => admins.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaFilesRelations = relations(mediaFiles, ({ one }) => ({
  uploader: one(admins, {
    fields: [mediaFiles.uploaderId],
    references: [admins.id],
  }),
}));

// -------------------------------------------------------------
// Enquiries Table (website contact form)
// -------------------------------------------------------------
export const enquiries = mysqlTable("enquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  service: varchar("service", { length: 120 }),
  pickupDate: varchar("pickup_date", { length: 40 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "closed"]).default("new").notNull(),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: varchar("user_agent", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Types
export type Enquiry = typeof enquiries.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type NewBlogCategory = typeof blogCategories.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type NewMediaFile = typeof mediaFiles.$inferInsert;

