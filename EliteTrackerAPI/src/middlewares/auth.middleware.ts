import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../@types/user.type";

const { JWT_SECRET: jwtSecret } = process.env;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: "❌Token not provided." });
  }

  const token = authToken.split(" ")[1];

  try {
    jwt.verify(String(token), String(jwtSecret), (err, decoded) => {
      if (err) {
        throw new Error();
      }

      //Adicionando o campo user no Request por meio do middleware e usando o type User
      req.user = decoded as User;

      return;
    });
  } catch {
    return res.status(401).json({ error: "❌Token is not valid." });
  }

  next();
};
