import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
  if (!name || !userId) {
    const x = !name ? "name" : "user";
    throw new Error(`${x} is required`);
  }

  try {
    const project = await projectModel.create({ name, users: [userId] });
    return project;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }
    throw error;
  }
};

export const getAllProjectsByUserId = async (userId) => {
  if (!userId) throw new Error(`userId is required`);

  const allUserProjects = await projectModel.find({ users: userId });

  return allUserProjects;
};

export const addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !users) {
    const x = !projectId ? "projectId" : "users";
    throw new Error(`${x} is required`);
  }

  if (!userId) throw new Error(`userId is required`);

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const project = await projectModel.findById({
    _id: projectId,
    users: userId,
  });

  if (!project) throw new Error("User not belongs to this project");

  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: { $each: users },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;
};


export const getProjectById = async({projectId}) => {
    if(!projectId) throw new Error("Project ID is required");

    try{
        const projects = await projectModel.findOne({_id: projectId}).populate('users');
        return projects;
    } catch(error){
        throw new Error(error.message);
    }
}