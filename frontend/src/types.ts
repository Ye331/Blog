/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  github?: string;
  twitter?: string;
  email?: string;
}

export type UserRole = 'guest' | 'admin';
