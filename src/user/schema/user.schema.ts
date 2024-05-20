import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  Other = 'Other'
} 

@Schema({
  timestamps: true
})
export class User extends Document {
  @ApiProperty({ example: '<firebase id>', description: 'Firebase Id obtained from Google Auth' })
  @Prop({ required: [true, "Firebase user id is required!"], unique: [true, "Duplicate firebase user id."]})
  fId: string; // fId -> firebaseId

  @ApiProperty({ example: 'John', description: 'First Name' })
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
  gender: Gender;

  @ApiProperty({ example: 25, description: 'Age' })
  @Prop()
  age: number;

  @ApiProperty({ example: 1234567890, description: 'Phone Number' })
  @Prop()
  phone: number;

  @ApiProperty({ example: 'false', description: 'Is Admin Boolean Value'})
  @Prop()
  isAdmin: boolean;
  
}

export const UserSchema = SchemaFactory.createForClass(User);