import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  body("name").isString().withMessage("Name is required"),
  authMiddleware.authUser,
  projectController.createProjectController
);

router.get(
  "/all",
  authMiddleware.authUser,
  projectController.getAllProjectsController
);

router.put(
  "/add-user",
  authMiddleware.authUser,
  body("projectId").isString().withMessage("Project ID musst be a string"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("users must be an array of strings")
    .bail()
    .custom((user) => user.every((user) => typeof user === "string"))
    .withMessage("each user must be a string"),
  projectController.addUserToProjectController
);

router.put('/update-file-tree', authMiddleware.authUser, 
  body('projectId').isString().withMessage('Project ID must be a string'),
  body('fileTree').isObject().withMessage('File tree must be a string and not null/undefined'),
  projectController.updateFileTreeController
 )


router.get("/get-projects/:projectId", authMiddleware.authUser, projectController.getProjectsByIdController);

export default router;
