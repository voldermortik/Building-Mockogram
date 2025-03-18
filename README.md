# Welcome to Mockagram!

Mockagram is a brand new service that does something completely revolutionary: users can share pictures with other users. Yes, you read right - nobody else does this!

In all seriousness, this project is for the Interview Kickstart live coding session centered around building a mock version of Instagram.

## Overview

To get started, you can clone this GitHub repo to your local machine.

> New to Git? See https://www.atlassian.com/git

This project is written in TypeScript for both the front-end and the back-end. The front-end (the `frontend` folder) leverages a React-based front-end built and devleloped using Vite. The back-end (the `backend` folder) runs on Node.js and uses the Express library to serve requests. 

> New to any of this? Here are some resources to help you get started:
> 
> **JavaScript:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction
> 
> **TypeScript:** https://www.typescriptlang.org/docs/
> 
> **React:** https://react.dev/learn
> 
> **Vite:** https://vite.dev/guide/
> 
> **Node.js:** https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
> 
> **Express:** https://expressjs.com/en/starter/hello-world.html

There is another service: Mockstore (in the `mockstore` folder). This service also runs on Node.js and Express and provides a mock service for "cloud" storage like Amazon AWS S3. In reality, the files will be served from a folder on the same drive as the `mockstore` folder. During the live session, we will run the service and use its API's to upload and retrieve information about images (and will make requests to the `files` on the Mockstore server to get the images), but we will not be making changes to Mockstore - so you can ignore the implementation unless you are curious about how it works.

## Databases and Seeding Your Data

We are using MongoDB for our data storage. We also use Mongoose, an ODM (object data modeling) library, to connect, read, and make changes to the database.

> New to any of this? Here are some resources to help you get started:
> 
> **MongoDB:** https://www.mongodb.com/resources/products/fundamentals/basics
> 
> **Mongoose:** https://mongoosejs.com/docs/guide.html

The two back-end services use in-memory MongoDB databases (NoSQL), so you don't have to install MongoDB. Do note that, because these databases are in-memory, service restarts will wipe the databae. This will happen not just when you manually restart them, but also when you make changes to the code (due to hot reloading for easier previewing of updates). We've provided database seeding code which will run on every server start.

> You can skip ahead to the "Run Mockagram" section if you are okay with the default user, post, and image content. Read on if you want to customize or understand how we are seeding the databases.

Mockagram's seeding code is in its `src/db/seeding/seedDb.ts` file. In `src/db/seeding/data/seedData.json`, you can customize the users, posts, and the comments that appear under posts. Each user requires a username, e-mail address, and password - you can also specify a custom ID intead of generating a random one (which can be helpful in testing). Each post definition only requires a username and an ID of the image to be pulled from Mockstore. The array of comments provides a random choice for every post as to which comment is applied to it.

Each image "stored" inside Mockstore has a unique ID tied to it. Mockstore can read the filenames of the images in the `filestore` folder to manually set the id's of the images in the database. For instance, if you name a file `67c6281cffbf1eef9bb60276.jpg`, Mockstore will add an image to its database with the ID of `67c6281cffbf1eef9bb60276`. You can then specify a post in Mockagram's `seedData.json` to use `"67c6281cffbf1eef9bb60276"` for the `"postImageId"`.

**To help you get started, we've already setup image files in the Mockstore with ID's that are referenced by `seedData.json`.** If you'd like to use your own photos, feel free to replace them - just make sure to preserve the file names. A list of the default ID's / filenames is provided below:

| Image ID in `seedData.json`  | Filename in Mockstore's `filestore` folder |
| ---------------------------- | ------------------------------------------ |
| `"67c6281cffbf1eef9bb60276"` | 67c6281cffbf1eef9bb60276.jpg               |
| `"67c6281cffbf1eef9bb60279"` | 67c6281cffbf1eef9bb60279.jpg               |
| `"67c6281cffbf1eef9bb6027c"` | 67c6281cffbf1eef9bb6027c.jpg               |
| `"67c6281cffbf1eef9bb60285"` | 67c6281cffbf1eef9bb60285.jpg               |
| `"67c6281cffbf1eef9bb6027f"` | 67c6281cffbf1eef9bb6027f.jpg               |
| `"67c631fb4284a65414db557d"` | 67c631fb4284a65414db557d.jpg               |

## Run Mockagram

After you setup your images (and optional data to seed), all three of these projects are ready-to-go out-of the box (all dependencies have been added - you can see them in their `package.json` files).

Before you start - assuming you haven't changed any of the environment variable files - make sure nothing is running on ports 5317 (Mockagram front-end dev server), 3000 (Mockagram back-end), 1337 (Mockstore service), and 32023 and 64046 (in-memory databases for Mockagram and Mockstore, respectively).

To run Mockagram locally:

1. Open your terminal and navigate to the `mockstore` directory
2. Run `npm install` and then `npm run start` (this will start Mockstore) - leave this terminal open
3. Open a new terminal and navigate to the `mockstore` directory
4. Run `npm install` and then `npm run start` (this will start the Mockagram back-end) - leave this terminal open
5. Open a new terminal and navigate to the `frontend` directory
6. Run `npm install` and then `npm run dev` (not `start` this time! - this will start the Mockagram front-end dev server) - leave this terminal open

At this point, you should get a "Welcome to Mockagram" message at `http://localhost:5317`.

## Branches

This repo contains several branches with the project in various states.

First, there is the **start** branch - this is the primary branch and the one with the state of the project where we will start coding from in the live session.

Next, there is the **main** branch. This contains the completed project. Before the class, feel free to switch over to this branch to see what the final product will look like - but don't forget to switch back to the **start** branch before the session!

Finally, there are several **checkpoint** branches, such as **checkpoint-1**, **checkpoint-2**, etc. If you are unable to follow along and complete one of the portions of the live coding sessions, we will call out that you can switch to one of these checkpoint branches to get your project in a state where you can continue. Note that we will have everyone switch over to a checkpoint branch mid-way during the session to skip ahead several steps to the final exercise. 

## Other Setup and Preparation

**We recommend that you do a `git pull` on this repo (or do a fresh clone) the day of the session to get any last-minute updates to the project.**

For the live session, it is recommended to add this project in your favorite IDE, like [Visual Studio Code](https://code.visualstudio.com/download). You'll also need your favorite web browser handy to use Mockagram!

There are two free tools you should download:

* **Bruno** - https://www.usebruno.com/
  * Used for API testing
  * all configuration is provided in the `api-testing` directory
  * if you open that folder in Bruno, you'll be able to test all the API's we are building in the class
* **MongoDb Compass** - https://www.mongodb.com/products/tools/compass
  * Used to manually browse and edit MongoDB databases
  * Before the class, you can add the Mockstore and Mockgram databases by clicking on the plus sign next to `Connections` in the UI
    * By default, Mockagram is at `mongodb://localhost:64046/`
    * By default, Mockstore is at `mongodb://localhost:32023/`
  * While running Mockstore and Mockagram back-end services, you can can connect to these databases

While we will not go over these in detail, Mockagram uses the following which we will touch on briefly (feel free to read an overview):

* **ESLint** - code formatting - https://eslint.org/docs/latest/use/core-concepts/
* **Tailwind** - pre-defined CSS styles written in JavaScript - https://tailwindcss.com/docs/styling-with-utility-classes
* **Jest** - JavaScript-based test framework - https://jestjs.io/docs/getting-started
