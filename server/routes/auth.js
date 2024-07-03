import express from "express";
import { login } from "../contollers/auth";

const router = express.Router();

router.post("/login", login);
