import type React from "react";
import type { PrismaClient } from "@prisma/client";

export interface PostContentPageProps {
  params: {
    id: string | number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar: string;
  votes: number;
  voters?: Vote[];
  children?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  content: string;
  userName: string;
  userAvatar: string;
  votes: number;
  voters?: Vote[];
  postId: number;
  parentId: number | null;
  children?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: number;
  postId: number;
  userId: string;
  score: number;
}

export interface IconProps {
  color?: string;
}

export interface LoaderProps {
  size?: number;
}

export interface SidebarItem {
  id: number;
  name: string;
  href: string;
  icon: (props: IconProps) => React.JSX.Element;
}

export interface Context {
  db: PrismaClient;
}

export interface APIResponse {
  success: boolean;
  result?: any;
  message?: string;
  error?: unknown;
}
