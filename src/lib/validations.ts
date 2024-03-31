import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().min(1, "User Id is required."),
  email: z.string().min(1, "Email is required").email("Must be a valid email."),
  name: z.string().min(1, "Username is required."),
  avatar: z.string().min(1, "User avatar is required."),
});

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  userId: z.string().min(1, "User Id is required."),
  userName: z.string().min(1, "User name is required."),
  userAvatar: z.string().min(1, "User avatar is required."),
});

export const CommentSchema = z.object({
  content: z.string().min(1, "Content is required."),
  postId: z.number(),
  parentId: z.number().optional(),
  userName: z.string().min(1, "User name is required."),
  userAvatar: z.string().min(1, "User avatar is required."),
});

export const VoteSchema = z.object({
  id: z.number().optional(),
  postType: z.number().default(0),
  postId: z.number(),
  userId: z.string().min(1, "User Id is required"),
  score: z.number().optional(),
});
