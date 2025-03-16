import { User } from '@/data/User'

export interface Post {
  _id: string;
  user: User;
  userComment: string | null;
  createDate: string;
  imageId: string;
}
