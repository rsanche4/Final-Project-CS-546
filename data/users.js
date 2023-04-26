import { users } from "../config/mongoCollections.js";
const saltRounds = 16;
import bcrypt from 'bcrypt';
import * as check from "../helpers.js";


export const createUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => {
  firstName = check.validString(firstName);
  lastName = check.validString(lastName);
  emailAddress = check.validEmail(emailAddress);
  password = check.validPassword(password);
  if (['admin', 'user'].indexOf(role.toLowerCase()) < 0) {
    throw new Error("Role can only be either 'admin' or 'user'.")
  }
  role = role.toLowerCase()
  const userCollection = await users();
  const emailExists = await userCollection.findOne({ emailAddress: emailAddress });
  if (emailExists) {
    throw new Error(`Email: ${emailAddress} already exists.`)
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    role: role,
    hashedPassword: hashedPassword
  }
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) {
    throw new Error(`Could not add user`);
  }
  return { insertedUser: true }
};

export const checkUser = async (emailAddress, password) => {
  emailAddress = check.validEmail(emailAddress);
  password = check.validPassword(password);
  const userCollection = await users();
  const emailExists = await userCollection.findOne({ emailAddress: emailAddress });
  if (!emailExists) {
    throw new Error("Either the username or password is invalid")
  }
  let compare = await bcrypt.compare(password, emailExists.hashedPassword);
  if (!compare) {
    throw new Error("Either the username or password is invalid")
  }
  return { firstName: emailExists.firstName, lastName: emailExists.lastName, emailAddress, role: emailExists.role }
};