import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

export default (app) => {
    app.use(cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }));
    app.use(express.json());
    app.use(cookieParser());
};