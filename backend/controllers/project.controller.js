import * as projectService from "../services/project.service.js";
import {validationResult} from "express-validator"
import userModel from "../models/user.model.js"
import mongoose from "mongoose";


export const createProjectController = async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name} = req.body;
    const loggedInUser = await userModel.findOne({email: req.user.email});
    const userId = loggedInUser._id;

    try{
        // const newProject = await projectService.createProject({name, userId});
        const project = await projectService.createProject({name, userId});
        res.status(201).json({project});

    } catch(error){
        res.status(400).send(error.message);
    }

}

export const getAllProjectsController = async (req, res) => {
    try{
        const loggedInUser = await userModel.findOne({email: req.user.email});
        const userId = loggedInUser._id;
        const allUserProjects = await projectService.getAllProjectsByUserId(userId);
        res.status(200).json({projects: allUserProjects});

    } catch(error){

        res.status(400).send(error.message);
    }

}

export const addUserToProjectController = async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.send(400).json({errors: errors.array()});
    }

    const {projectId, users} = req.body;

    const loggedInUser = await userModel.findOne({email: req.user.email})

    try{
        const project = await projectService.addUserToProject({projectId, users, userId: loggedInUser._id})
        return res.status(201).json(project)

    } catch(error){
        console.log(error)
        res.status(400).json({errors: error.message});
    }
}


export const getProjectsByIdController = async(req, res) => {
    const {projectId} = req.params;

    try{
        const projects = await projectService.getProjectById({projectId});
        return res.status(200).json({projects})
    } catch(error){
        res.status(400).json({errors: error.message});
    }


}

