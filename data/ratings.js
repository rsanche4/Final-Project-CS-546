import {ratings} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

let exportedMethods = {
    async getAllRatings(){
        const ratingCollection = await ratings();
        const ratingList = await ratingCollection.find([]).toArray();
        return ratingList;
    },
    async getRatingById(id){
        id = helpers.checkId(id, 'ratingsId');
        const ratingCollection = await ratings();
        const rating = await ratingCollection.findOne({_id: ObjectId(id)});
        if(!rating) throw 'Error: rating not found';
        return rating;
    },
    async addRating(barId, overall, crowdedness, cleanliness, price){
        barId = helpers.checkId(barId, 'barId');
        overall = helpers.checkOverallRating(overall, 'overallRating');
        crowdedness = helpers.checkRating(crowdedness, 'crowdednessRating');
        cleanliness = helpers.checkRating(cleanliness,'cleanlinessRating');
        price = helpers.checkPrice(price, 'priceRating');
        
        let newRating = {
            barId: barId,
            overall: overall,
            crowdedness: crowdedness,
            cleanliness: cleanliness,
            price: price
        };

        const ratingCollection = await ratings();
        const newInsertInfo = await ratingCollection.newInsertOne(newRating);
        if(!newInsertInfo.insertedId) throw 'new rating insert failed :(';
        return await this.getRatingById(newInsertInfo.insertedId.toString());
    },
    async removeRating(id){
        id = helpers.checkId(id, 'ratingId');
        const ratingCollection = await ratings();
        const deleteionInfo = await ratingCollection.findOneAndDelete({
            _id:ObjectId(id)
        });
        if(deleteionInfo.lastErrorObject.n === 0){
            throw [404, `Error: Could not delete rating with id ${id}`];
        }

        return {...deleteionInfo.value, deleted: true};
    },
    async updateRatingPatch(id, updatedRating){
        id = helpers.checkId(id);
    }
}

export default exportedMethods;