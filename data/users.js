import { users } from "../config/mongoCollections.js";
const saltRounds = 16;
import bcrypt from 'bcrypt';
import * as helpers from "../helpers.js";
import helpers_second from "../helpers.js" 
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
    const emailExists = await userCollection.findOne({ email: emailAddress });
    if (emailExists) {
        throw new Error(`Email: ${emailAddress} already exists.`)
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        hashedPassword: hashedPassword,
        role: role
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
    const emailExists = await userCollection.findOne({ email: emailAddress });
    if (!emailExists) {
        throw new Error("Either the username or password is invalid")
    }
    let compare = await bcrypt.compare(password, emailExists.hashedPassword);
    if (!compare) {
        throw new Error("Either the username or password is invalid")
    }
    return { _id: String(emailExists._id), firstName: emailExists.firstName, lastName: emailExists.lastName, email: emailAddress, role: emailExists.role }
};

let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id) {
        id = helpers_second.checkId(id, 'userID');
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) throw 'Error: User not found';
        return user;
    },
    //further error checking needed
    async addUser(firstName, lastName, email, password,role) {

        firstName = helpers_second.checkString(firstName, 'userFirstName');
        lastName = helpers_second.checkString(lastName, 'userLastName');
        email = helpers_second.checkString(email, 'userEmail');
        //username = helpers_second.checkString(username, 'userUsername');
        //role = helpers.validString
        //hashedPassword = helpers_second.checkString(hashedPassword, 'userHashedPassword');
        if(['admin','user'].indexOf(role.toLowerCase()) < 0){
            throw `Error: role must either be 'admin' or 'user'`
        }
        role = role.toLowerCase();
        let hashedPassword = helpers.validPassword(password);
        const hashedPassword2 = await bcrypt.hash(hashedPassword, saltRounds);
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            //username: username,
            hashedPassword: hashedPassword2,
            comments: [],
            role: role
        };

        const userCollection = await users();
        const newInsertInfo = await userCollection.insertOne(newUser);
        if (!newInsertInfo.insertedId) throw 'new user Insert failed :(';
        return await this.getUserById(newInsertInfo.insertedId.toString());

    },

    async removeUser(id) {
        id = helpers_second.checkId(id, 'userID');
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
            _id: new ObjectId(id)
        });
        if (deletionInfo.lastErrorObject.n === 0) {
            throw [404, `Error: Could not delete user with id ${id}`];
        }

        return { ...deletionInfo.value, deleted: true };
    },

    async updateUserPatch(id, updatedUser) {
        id = helpers_second.checkId(id, "userId");
        if (updatedUser.firstName) {
            updatedUser.firstName = helpers_second.checkString(
                updatedUser.firstName, 'userFirstName'
            );
        }
        if (updatedUser.lastName) {
            updatedUser.lastName = helpers_second.checkString(
                updatedUser.lastName, 'userLastNaame'
            );
        }
        if (updatedUser.email) {
            updatedUser.email = helpers_second.checkString(
                updatedUser.email, 'userEmail'
            );
        }
        /*if (updatedUser.username) {
            updatedUser.username = helpers_second.checkString(
                updatedUser.email, 'userUsername'
            );
        }*/
        if (updatedUser.hashedPassword) {
            updatedUser.hashedPassword = helpers_second.checkString(
                updatedUser.hashedPassword, 'userHashedPassword'
            );
        }
        if (!Array.isArray(updatedUser.comments)) {
            updatedUser.comments = [];
        } else {
            updatedUser.comments = helpers_second.checkStringArray(
                updatedUser.comments, 'comments');
        }

        const userCollection = await users();
        const updateInfo = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
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
