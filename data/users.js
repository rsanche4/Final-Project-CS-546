import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

let exportedMethods = {
    async getAllUsers(){
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id){
        id = helpers.checkId(id, 'userID');
        const userCollection = await users();
        const user = await userCollection.findOne({_id: ObjectId(id)});
        if(!user) throw 'Error: User not found'; 
        return user;
    },
    //further error checking needed
    async addUser(firstName, lastName, email, username, hashedPassword){
        firstName = helpers.checkString(firstName, 'userFirstName');
        lastName = helpers.checkString(lastName, 'userLastName');
        email = helpers.checkString(email, 'userEmail');
        username = helpers.checkString(username, 'userUsername');
        hashedPassword = helpers.checkString(hashedPassword, 'userHashedPassword');


        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            hashedPassword: hashedPassword,
            comments: []
        };

        const userCollection = await users();
        const newInsertInfo = await userCollection.insertOne(newUser);
        if(!newInsertInfo.insertedId) throw 'new user Insert failed :(';
        return await this.getUserById(newInsertInfo.insertedId.toString());

    },

    async removeUser(id){
        id = helpers.checkId(id, 'userID');
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
            _id:ObjectId(id)
        });
        if(deletionInfo.lastErrorObject.n === 0){
            throw [404, `Error: Could not delete user with id ${id}`];
        }

        return {...deletionInfo.value, deleted: true};
    },

    async updateUserPatch(id, updatedUser){
        id = helpers.checkId(id, "userId");
        if(updatedUser.firstName){
            updatedUser.firstName = helpers.checkString(
                updatedUser.firstName, 'userFirstName'
            );
        }
        if(updatedUser.lastName){
            updatedUser.lastName = helpers.checkString(
                updatedUser.lastName, 'userLastNaame'
            );
        }
        if(updatedUser.email){
            updatedUser.email = helpers.checkString(
                updatedUser.email, 'userEmail'
            );
        }
        if(updatedUser.username){
            updatedUser.username = helpers.checkString(
                updatedUser.email, 'userUsername'
            );
        }
        if(updatedUser.hashedPassword){
            updatedUser.hashedPassword = helpers.checkString(
                updatedUser.hashedPassword, 'userHashedPassword'
            );
        }
        if(!Array.isArray(updatedUser.comments)){
            updatedUser.comments = [];
        } else{
            updatedUser.comments = helpers.checkStringArray(
                updatedUser.comments, 'comments');
        }

        const userCollection = await users();
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: ObjectId(id)},
            {$set: updatedUser},
            {returnDocument: 'after'}
        );
        if(updateInfo.lastErrorObject.n === 0){
            throw [
                404,
                `Error: Update failed, could not find user with id ${id}`
            ];
        }
        return await updateInfo.value;
    }
};

export default exportedMethods;