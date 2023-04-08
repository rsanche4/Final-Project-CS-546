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
        id = helpers.checkId(id);
        const barCollection = await bars();
        const bar = await barCollection.findOne({_id: ObjectId(id)});
        if(!bar) throw `Error: Bar not found`;
        return bar;
    },
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
            ratingsAverate: {
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
    }


};

export default exportedMethods