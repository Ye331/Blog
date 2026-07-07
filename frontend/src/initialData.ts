/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost, UserProfile } from './types';

export const DEFAULT_AVATAR = "/avatar.jpg";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Yeye Yang",
  title: "",
  bio: "",
  avatar: DEFAULT_AVATAR,
};

export const INITIAL_POSTS: BlogPost[] = [];
