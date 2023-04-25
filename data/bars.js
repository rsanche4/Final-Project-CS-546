import {bars} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

let exportedMethods = {
    async getAllBars(){
        const barCollection = await bars();
        const barList = await barCollection.find({}).toArray();
        return barList;
    },
    async getBarById(id) {
        id = helpers.checkId(id, 'barID');
        const barCollection = await bars();
        const bar = await barCollection.findOne({_id: ObjectId(id)});
        if(!bar) throw `Error: Bar not found`;
        return bar;
    },
    //maybe need to add extra error checking. but this will do for now
    async addBar(name, location, description, picture) {
        name = helpers.checkString(name, 'barName');
        location = helpers.checkString(location, 'barLocation');
        description = helpers.checkString(description, 'barDescription');
        picture = helpers.checkString(picture, 'barPicture');

        let newBar = {
            name: name,
            location: location,
            description: description,
            comments: [],
            ratingsAverage: {
                overallAvg: 0,
                crowdednessAvg: 0,
                cleanlinessAvg: 0,
                priceAvg: 0
            },
            picture: picture
        }

        const barCollection = await bars();
        const newInsertInfo = await barCollection.insertOne(newBar);
        if(!newInsertInfo.insertedId) throw 'Insert failed';
        return await this.getBarById(newInsertInfo.insertedId.toString());
    },

    async removeBar(id){
        id = helpers.checkId(id, 'barID');
        const barCollection = await bars();
        const deleteionInfo = await barCollection.findOneAndDelete({
            _id: ObjectId(_id)
        });
        if (deleteionInfo.lastErrorObject.n === 0){
            throw [404, `Error: Could not delete user with id ${id}`];
        }

        return  {...deleteionInfo.value, deleted: true};
    },
    //need to error check ratingsAvg and comments
    async updateBarPatch(id, updatedBar){

        id = helpers.checkId(id, 'barID');

        if(updatedBar.name){
            updatedBar.name = helpers.checkString(updatedBar.name, 'barName');
        }
        if(updatedBar.location){
            updatedBar.location = helpers.checkString(updatedBar.location, 'barLocation');
        }
        if(updatedBar.description){
            updatedBar.description = helpers.checkString(updatedBar.description, 'barDescription');
        }
        if(updatedBar.picture){
            updatedBar.picture = helpers.checkString(updatedBar.picture, 'barPicture');
        }
        if(!Array.isArray(updatedBar.comments)){
            updatedBar.comments = [];
        }
        else{
            updatedBar.comments = helpers.checkStringArray(
                updatedBar.comments, 'comments'
            );
        }
        if(!updatedBar.ratingsAverage){
            updatedBar.ratingsAverage = {
                overallAvg: 0,
                crowdednessAvg: 0,
                cleanlinessAvg: 0,
                priceAvg: 0
            };
        }
        else{
            updatedBar.ratingsAverage = helpers.ratingsAverage(
                updatedBar.ratingsAverage, 'ratingsAverage');
        }
        const barCollection = await bars();
        const updateInfo = await barCollection.findOneAndUpdate(
            {_id: ObjectId(id)},
            {$set: updatedBar},
            {returnDocument: 'after'}
        );
        if(updateInfo.lastErrorObject.n === 0){
            throw[
                404,
                `Error: Update failed, could not find a user with id of ${id}`
            ];
        }
        return await updateInfo.value;
    }
};

export default exportedMethods