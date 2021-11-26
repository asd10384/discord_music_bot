import { IUser } from "../types/interfaces/Mongoose";
import { Schema, Model, model, models } from "mongoose";
import { botnumber } from "../config";

export const User = new Schema({
  userId: { type: String, required: true }
});

export const UserModel: Model<IUser> = models.User || model<IUser>(`User${botnumber}`, User);
