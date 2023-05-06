import { users } from "../config/mongoCollections.js";
const saltRounds = 16;
import bcrypt from 'bcrypt';
//import * as helpers from "../helpers.js";
import helpers from "../helpers.js";
//import { validString } from "../helpers.js";
import { ObjectId } from 'mongodb';

export const createUser = async (
    firstName,
    lastName,
    emailAddress,
    password,
    role
) => {
    firstName = helpers.validString(firstName);
    lastName = helpers.validString(lastName);
    emailAddress = helpers.validEmail(emailAddress);
    password = helpers.validPassword(password);
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
    emailAddress = helpers.validEmail(emailAddress);
    password = helpers.validPassword(password);
    const userCollection = await users();
    const emailExists = await userCollection.findOne({ emailAddress: emailAddress });
    if (!emailExists) {
        throw new Error("Either the username or password is invalid")
    }
    let compare = await bcrypt.compare(password, emailExists.hashedPassword);
    if (!compare) {
        throw new Error("Either the username or password is invalid")
    }
    return { _id: String(emailExists._id), firstName: emailExists.firstName, lastName: emailExists.lastName, emailAddress, role: emailExists.role }
};

let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id) {
        id = helpers.checkId(id, 'userID');
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) throw 'Error: User not found';
        return user;
    },
    //further error checking needed
    async addUser(firstName, lastName, email, username, password,role) {

        firstName = helpers.checkString(firstName, 'userFirstName');
        lastName = helpers.checkString(lastName, 'userLastName');

        console.log("this is email: " + email);
        email = helpers.validEmail(email);
        username = helpers.checkString(username, 'userUsername');
        password = helpers.validPassword(password);

        if(['admin','user'].indexOf(role.toLowerCase()) < 0){
            throw new Error("Role can only be either 'admin' or 'user'.");
        }

        role = role.toLowerCase();

        const userCollection = await users();
        const emailExists = await userCollection.findOne({email: email});
        const usernameExists = await userCollection.findOne({username: username});
        
        if(emailExists){
            throw `Error: Email Address '${email}' already exists.`;
        }

        if(usernameExists){
            throw `Error: Username '${username}' already exists.`;
        }

        const hashedPassword = await bcrypt.hash(password,saltRounds);

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            hashedPassword: hashedPassword,
            role,
            comments: []
        };

        const newInsertInfo = await userCollection.insertOne(newUser);
        if (!newInsertInfo.insertedId) throw 'new user Insert failed :(';
        return await this.getUserById(newInsertInfo.insertedId.toString());

    },

    async removeUser(id) {
        id = helpers.checkId(id, 'userID');
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
            _id: ObjectId(id)
        });
        if (deletionInfo.lastErrorObject.n === 0) {
            throw [404, `Error: Could not delete user with id ${id}`];
        }

        return { ...deletionInfo.value, deleted: true };
    },

    async updateUserPatch(id, updatedUser) {
        id = helpers.checkId(id, "userId");
        if (updatedUser.firstName) {
            updatedUser.firstName = helpers.checkString(
                updatedUser.firstName, 'userFirstName'
            );
        }
        if (updatedUser.lastName) {
            updatedUser.lastName = helpers.checkString(
                updatedUser.lastName, 'userLastNaame'
            );
        }
        if (updatedUser.email) {
            updatedUser.email = helpers.checkString(
                updatedUser.email, 'userEmail'
            );
        }
        if (updatedUser.username) {
            updatedUser.username = helpers.checkString(
                updatedUser.email, 'userUsername'
            );
        }
        if (updatedUser.hashedPassword) {
            updatedUser.hashedPassword = helpers.checkString(
                updatedUser.hashedPassword, 'userHashedPassword'
            );
        }
        if (!Array.isArray(updatedUser.comments)) {
            updatedUser.comments = [];
        } else {
            updatedUser.comments = helpers.checkStringArray(
                updatedUser.comments, 'comments');
        }

        const userCollection = await users();
        const updateInfo = await userCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: updatedUser },
            { returnDocument: 'after' }
        );
        if (updateInfo.lastErrorObject.n === 0) {
            throw [
                404,
                `Error: Update failed, could not find user with id ${id}`
            ];
        }
        return await updateInfo.value;
    }
};

export default exportedMethods;
