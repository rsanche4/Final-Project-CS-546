import {ratings} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';
import bars from './bars.js';

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
        barId = helpers.checkId(barId, 'barId');
        const ratingCollection = await ratings();
        const ratingArray = await ratingCollection
        .find({barId: barId})
        .toArray();
        if(!ratingArray){
            throw `Error: ratings with barId '${barId}' not found`;
        }
        if(ratingArray.length < 1){
            throw `Error: ratings with barId: '${barId}' not found`;
        }
        return ratingArray;
    },
    async addRating(barId, overall, crowdedness, cleanliness, price, userId, waittime){
        barId = helpers.checkId(barId, 'ratingBarId');
        userId = helpers.checkId(userId, 'userId');
        overall = helpers.checkOverallRating(overall, 'overallRating');
        crowdedness = helpers.checkRating(crowdedness, 'crowdednessRating');
        cleanliness = helpers.checkRating(cleanliness,'cleanlinessRating');
        price = helpers.checkRating(price, 'priceRating');
        waittime = helpers.checkRating(waittime, 'waittimeRating');

        const theBar = await bars.getBarById(barId);

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

        const allBarRatings = await this.getRatingsByBar(theBar._id.toString());
        let totalBarRatings = allBarRatings.length;

        let currOA = theBar.ratingsAverage.overallAvg;
        let currCrA = theBar.ratingsAverage.crowdednessAvg;
        let currClA = theBar.ratingsAverage.cleanlinessAvg;
        let currPriceAvg = theBar.ratingsAverage.priceAvg;
        let currWA = theBar.ratingsAverage.waittimeAvg;
        
        let newOverallAvg = Math.floor(((currOA*totalBarRatings) + overall)/(totalBarRatings + 1));
        let newCrowdednessAvg = Math.floor(((currCrA*totalBarRatings) + cleanliness)/(totalBarRatings + 1));
        let newCleanlinessAvg = Math.floor(((currClA*totalBarRatings) + crowdedness)/(totalBarRatings + 1));
        let newPriceAvg = Math.floor(((currPriceAvg*totalBarRatings) + overall)/(totalBarRatings + 1));
        let newWaittimeAvg = Math.floor(((currWA*totalBarRatings) + waittime)/(totalBarRatings + 1));

        console.log(`bid: ${barId} bn: ${theBar.name} \nnoa: ${newOverallAvg}, ncra: ${newCrowdednessAvg}, ncla: ${newCleanlinessAvg}, npa: ${newPriceAvg}`);
        await bars.updateBarPatch(barId,{
            ratingsAverage:{
                overallAvg: newOverallAvg,
                crowdednessAvg: newCrowdednessAvg,
                cleanlinessAvg: newCleanlinessAvg,
                priceAvg: newPriceAvg,
                waittimeAvg: newWaittimeAvg
            }
        });

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