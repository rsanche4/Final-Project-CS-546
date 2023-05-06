import {ratings} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';
import users from './users.js'
import bars from './bars.js'

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
    async getRatingsByBar(barId){
        barId= helpers.checkId(barId,'ratingsbarId');
        const ratingCollection = await ratings();
        const ratingArray = await ratingCollection
        .find( {barId:barId})
        .toArray();
        if (!ratingArray){
            throw `Error: ratings with barId '${barId}' not found`;
        }
        if(ratingArray.length < 1){
            throw `Error: ratings with barId '${barId}' not found`;
        }
        return ratingArray;
    },
    async getRatingsByUser(userId){
        barId= helpers.checkId(userId,'userId');
        const ratingCollection = await ratings();
        const ratingArray = await ratingCollection
        .find( {userId:userId})
        .toArray();
        if (!ratingArray){
            throw `Error: ratings with barId '${userId}' not found`;
        }
        if(ratingArray.length < 1){
            throw `Error: ratings with barId '${userId}' not found`;
        }
        return ratingArray;
    },
    async addRating(barId, overall, crowdedness, cleanliness, price, userId){
        barId = helpers.checkId(barId, 'barId');
        userId = helpers.checkId(userId, 'userId');
        overall = helpers.checkOverallRating(overall, 'overallRating');
        crowdedness = helpers.checkRating(crowdedness, 'crowdednessRating');
        cleanliness = helpers.checkRating(cleanliness,'cleanlinessRating');
        price = helpers.checkRating(price, 'priceRating');

        //const theUser = users.getUserById(userId);
        const theBar = await bars.getBarById(barId);
        //const theBarRatings = theBar.ratingsAverage;
        
        let newRating = {
            barId: barId,
            userId: userId,
            overall: overall,
            crowdedness: crowdedness,
            cleanliness: cleanliness,
            price: price
        };

        const ratingCollection = await ratings();
        const newInsertInfo = await ratingCollection.insertOne(newRating);
        if(!newInsertInfo.insertedId) throw 'new rating insert failed :(';
        
        //console.log("in ratings: barId: "+theBar._id);
        const allBarRatings = await this.getRatingsByBar(theBar._id.toString());
        let totalBarRatings = allBarRatings.length;

        let currOA = theBar.ratingsAverage.overallAvg;
        let currCrA = theBar.ratingsAverage.crowdednessAvg;
        let currClA = theBar.ratingsAverage.cleanlinessAvg;
        let currPA = theBar.ratingsAverage.priceAvg;

        let newOverallAvg = ((currOA*totalBarRatings) + overall)/(totalBarRatings + 1);
        let newCrowdednessAvg = ((currCrA*totalBarRatings) + cleanliness)/(totalBarRatings + 1);
        let newCleanlinessAvg = ((currClA*totalBarRatings) + crowdedness)/(totalBarRatings + 1);
        let newPriceAvg = ((currPA*totalBarRatings) + price)/(totalBarRatings + 1);

        await bars.updateBarPatch(barId,{
            ratingsAverage:{
                overallAvg: newOverallAvg,
                crowdednessAvg: newCrowdednessAvg,
                cleanlinessAvg: newCleanlinessAvg,
                priceAvg: newPriceAvg
            }
        });
        /*const userUpdated = users.updateUserPatch(userId,{
            
        })*/

        return await this.getRatingById(newInsertInfo.insertedId.toString());
        
    },
    async removeRating(id){
        id = helpers.checkId(id, 'ratingId');
        const ratingCollection = await ratings();
        const deletionInfo = await ratingCollection.findOneAndDelete({
            _id:ObjectId(id)
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