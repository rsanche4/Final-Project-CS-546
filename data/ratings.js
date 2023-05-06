import {ratings} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

let exportedMethods = {
    async getAllRatings(){
        const ratingCollection = await ratings();
        const ratingList = await ratingCollection.find({}).toArray();
        return ratingList;
    },
    async getRatingById(id){
        id = helpers.checkId(id, 'ratingsId');
        const ratingCollection = await ratings();
        const rating = await ratingCollection.findOne({_id: new ObjectId(id)});
        if(!rating) throw 'Error: rating not found';
        return rating;
    },
    async addRating(barId, overall, crowdedness, cleanliness, price, userId, waittime){
        barId = helpers.checkId(barId, 'barId');
        userId = helpers.checkId(userId, 'userId');
        overall = helpers.checkOverallRating(overall, 'overallRating');
        crowdedness = helpers.checkRating(crowdedness, 'crowdednessRating');
        cleanliness = helpers.checkRating(cleanliness,'cleanlinessRating');
        price = helpers.checkRating(price, 'priceRating');
        waittime = helpers.checkRating(waittime, 'waittimeRating');

        let newRating = {
            barId: barId,
            userId: userId,
            overall: overall,
            crowdedness: crowdedness,
            cleanliness: cleanliness,
            price: price,
            waittime: waittime
        };

        const ratingCollection = await ratings();
        const newInsertInfo = await ratingCollection.insertOne(newRating);
        if(!newInsertInfo.insertedId) throw 'new rating insert failed :(';
        return await this.getRatingById(newInsertInfo.insertedId.toString());
    },
    async removeRating(id){
        id = helpers.checkId(id, 'ratingId');
        const ratingCollection = await ratings();
        const deletionInfo = await ratingCollection.findOneAndDelete({
            _id:new ObjectId(id)
        });
        if(deletionInfo.lastErrorObject.n === 0){
            throw [404, `Error: Could not delete rating with id ${id}`];
        }

        return {...deletionInfo.value, deleted: true};
    },
    async updateRatingPatch(id, updatedRating){
        id = helpers.checkId(id, "ratingId");
        if(updatedRating.barId){
            updatedRating.barId = helpers.checkId(
                updatedRating.barId, 'ratingBarId'
            );
        }
        if(updatedRating.userId){
            updatedRating.userId = helpers.checkId(
                updatedRating.userId, 'ratingUserId'
            );
        }
        if(updatedRating.overall){
            updatedRating.overall = helpers.checkOverallRating(
                updatedRating.overall, "ratingOverallRating"
            );
        }
        if(updatedRating.crowdedness){
            updatedRating.crowdedness = helpers.checkRating(
                updatedRating.crowdedness, "ratingCrowdednessRating"
            );
        }
        if(updatedRating.cleanliness){
            updatedRating.cleanliness = helpers.checkRating(
                updatedRating.cleanliness, "ratingCleanlinessRating"
            );
        }
        if(updatedRating.price){
            updatedRating.price = helpers.checkRating(
                updatedRating.price, "ratingPriceRating"
            );
        }
        if(updatedRating.waittime){
            updatedRating.waittime = helpers.checkRating(
                updatedRating.waittime, "ratingWaittimeRating"
            );
        }

        const ratingCollection = await ratings();
        const updateInfo = await ratingCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedRating},
            {returnDocument: 'after'}
        );
        if(updateInfo.lastErrorObject.n === 0){
            throw[
                404, `Error: Update failed, could not find rating with id ${id}`
            ];
        }
        return await updateInfo.value;
    }
};

export default exportedMethods;