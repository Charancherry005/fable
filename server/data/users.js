const { users, stories } = require("../config/mongoCollections");
const { firebaseApp } = require("../initFirebaseAdmin");

const createUser = async (userId, emailAddress, displayName) => {
  const usersCollection = await users();
  const findUser = await usersCollection.findOne({ _id: userId });
  if (findUser) {
    throw `User already exists with given displayName / id.`;
  }
  let user = {
    _id: userId,
    emailAddress,
    wpm: 200,
    displayName,
    storiesPosted: [],
  };
  const insertUser = await usersCollection.insertOne(user);
  if (insertUser.insertedCount === 0) throw `Couldn't insert user to database.`;
  return await usersCollection.findOne({ _id: insertUser.insertedId });
};

const getPublicProfile = async (userId) => {
  const usersCollection = await users();
  const storiesCollection = await stories();
  const findUser = await usersCollection.findOne({ _id: userId });
  if (!findUser) {
    throw `User does not exist with id ${userId}`;
  }
  const userStories = await storiesCollection.find({ creatorId: findUser._id }).toArray();
  // TODO get user liked stories
  findUser.storiesCreated = userStories;
  return findUser;
};

const updateUser = async (userId, displayName, wpm, filePath) => {
  const usersCollection = await users();
  if (wpm < 30 || wpm > 500) {
    throw "Invalid wpm count. Should be more than 30 and less than 500.";
  }
  const findUser = await usersCollection.findOne({ _id: userId });
  if (!findUser) {
    throw `User does not exist with id ${userId}`;
  }
  const checkUsername = await usersCollection.findOne({
    displayName: { $regex: new RegExp("^" + displayName + "$", "i") },
  });
  if (checkUsername && userId !== checkUsername._id) {
    throw `Username is already taken!`;
  }
  // propagate update across firebase & mongodb
  await firebaseApp.auth().updateUser(userId, {
    displayName,
  });
  let updatedUser = {
    displayName,
    wpm,
    userAvatar: filePath ? filePath : null,
  };
  const performedUpdate = await usersCollection.updateOne({ _id: userId }, { $set: updatedUser });
  const updateUser = await usersCollection.findOne({ _id: userId });
  return updateUser;
};

const checkDisplayName = async (name) => {
  const usersCollection = await users();
  const findUser = await usersCollection.findOne({
    displayName: { $regex: new RegExp("^" + name + "$", "i") },
  });
  if (findUser) {
    throw `This username is not available. Please use some other name instead.`;
  }
  return { isAvailable: true };
};

const getStoriesOfUser = async (userId, skip = 0, take = 20) => {
  const storiesCollection = await stories();
  const userStories = await storiesCollection.find({ creatorId: userId }).skip(skip).limit(take).toArray();
  let next = await storiesCollection
    .find({ creatorId: userId })
    .skip(skip + take)
    .limit(take)
    .tryNext();
  return { success: true, stories: userStories, next: next ? true : false };
};

module.exports = {
  createUser,
  getPublicProfile,
  updateUser,
  checkDisplayName,
  getStoriesOfUser,
};
