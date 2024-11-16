import { Request, Response } from "express";

export function sayHello(req: Request, res: Response) {
  res.send("Hello! Server is online...");
}