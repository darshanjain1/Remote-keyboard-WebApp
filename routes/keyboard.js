import { Router } from "express";
import keyboardController from "../controllers/keyboard.controller.js";

const keyboardRouter = Router();

// Route to get the current keyboard state and user details
keyboardRouter.get("/", keyboardController.getKeyboard);

// Route to get details of a specific user by ID
keyboardRouter.get("/user/:id", keyboardController.getKeyboardUserDetails);

// Route to release keyboard control from the current user
keyboardRouter.post("/release-control", keyboardController.releaseKeyboardControl);

// Route to acquire keyboard control for a specific user
keyboardRouter.post("/acquire-control", keyboardController.acquireKeyboardControl);

// Route to handle key press events
keyboardRouter.post("/press", keyboardController.keyPressed);

export default keyboardRouter;
