import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  Other = 'Other'
}

export enum UserAuthLevel {
  UNVERIFIED = 'unverified',
  NEW = 'new',
  BASIC = 'basic',
  ADMIN = 'admin'
}

@Schema({
  timestamps: true
})
export class User extends Document {
  @ApiProperty({ example: 'Updated', description: 'Updated' })
  @Prop({ required: [true, "First name is required!"] })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @Prop()
  lastName: string;

  @ApiProperty({ example: 'JohnDoe@gmail.com', description: 'Email Address' })
  @Prop({ unique: [true, "Duplicated email address."]})
  email: string;

  @ApiProperty({ example: 'male', description: 'Gender' })
  @Prop()
  gender?: Gender;

  @ApiProperty({ example: 25, description: 'Age' })
  @Prop()
  age?: number;

  @ApiProperty({ example: 1234567890, description: 'Phone Number' })
  @Prop()
  phone?: number;

  @ApiProperty({ example: 'false', description: 'Is Admin Boolean Value'})
  @Prop()
  isAdmin?: boolean;

  @ApiProperty({ description: 'Hashed password. We do not store the real password.' })
  @Prop({ type: String })
  hashedPassword?: string;

  @ApiProperty({ description: 'Delete Status' })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ description: 'Deleted At' })
  @Prop()
  deletedAt: Date;

  @ApiProperty({ description: 'OAuth providers' })
  @Prop({ type: [Object], default: [] })
  providers: {
    provider: string;
    providerId: string;
  }[];

  // picture
  @ApiProperty({ description: 'Profile picture URL' })
  @Prop()
  picture: string;

  @Prop({ type: String, default: UserAuthLevel.UNVERIFIED })
  authLevel: UserAuthLevel;

  @Prop({ type: {
    code: String,
    expiration: Date
  }, default: null })
  otp: {
    code: string;
    expiration: Date;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
