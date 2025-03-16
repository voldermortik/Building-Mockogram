import mongoose from 'mongoose';
import argon2 from 'argon2';
import { User,
IUser } from '@/models/User.js';
import { Post } from '@/models/Post';
import seedData from '@/db/seeding/data/seedData.json' with { type: 'json' };
import { env } from '@/config/env';

// Function to create a new user
const createUser = async (
  username: string,
  email: string,
  password: string,
  customId: string
): Promise<IUser> => {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: env.ARGON2_MEMORY_COST,
      timeCost: env.ARGON2_TIME_COST,
      parallelism: env.ARGON2_PARALLELISM
    });

    const user = await User.create({
      _id: customId ? mongoose.Types.ObjectId.createFromHexString(customId) : new mongoose.Types.ObjectId(),
      username,
      email,
      hashedPassword
    });
    console.log('Created new user:', username);
    return user;
  } catch (error) {
    console.error(`Error creating user ${username}:`, error);
    throw error;
  }
};

// Helper function to get random date in last month
const getRandomDate = (): Date => {
  const now = new Date();
  const lastMonth = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  return new Date(lastMonth.getTime() + Math.random() * (now.getTime() - lastMonth.getTime()));
};

// Helper function to get random comment
const getRandomComment = (): string =>
  seedData.comments[Math.floor(Math.random() * seedData.comments.length)];

export const seedDatabase = async (): Promise<void> => {
  try {
    // Create users
    const createdUsers = await Promise.all(
      seedData.users.map(userData =>
        createUser(
          userData.username.toLowerCase(),
          userData.email,
          userData.password,
          userData.customId
        )
      )
    );

    // Create a map of usernames to user IDs for easy lookup
    const userMap = new Map(
      createdUsers.map(user => [user.username.toLowerCase(), user._id])
    );

    console.log(userMap);

    // Create posts
    await Post.create(
      seedData.posts.map(postData => ({
        user: userMap.get(postData.authorUsername.toLowerCase()),
        userComment: getRandomComment(),
        createDate: getRandomDate(),
        imageId: postData.postImageId
      }))
    );

    console.log('Seed posts created successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
}; 
