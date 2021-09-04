import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	password: string;
	projectIds: Array<string>;
	createdAt: Date;
	updatedAt: Date;
}

export const UserSchema = new Schema(
	{
		username: {
			unique: true,
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		projectIds: Array,
	},
	{
		timestamps: true,
	}
);

const User = model<IUser>("user", UserSchema);
export default User;
