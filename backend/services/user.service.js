import userModel from "../models/user.model.js";

const createUser = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password are required");

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    email,
    password: hashedPassword,
  });


  return user;
};

const getAllUser = async ({userId}) => {
  try{
    const users = await userModel.find({_id : {$ne: userId}});
    return users;
    
  } catch(error){
    throw new Error(error.message);
  }
}

export default {createUser, getAllUser}
