import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'sales'
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ['admin', 'sales'],
            default: 'sales',
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model<IUser>('User', userSchema)

export default User
