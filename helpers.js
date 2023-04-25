import {ObjectId} from 'mongodb';

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: missing ${varName} parameter`;
        if (typeof id !== 'string') throw `Error: ${varName} must be of type string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be empty string`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },
    
    checkString(strVal, varName){
        if(!strVal) throw `Error: missing ${varName} parameter`;
        if(typeof strVal !== 'string') throw `Error: ${varName} must be of type string`;
        strVal = strVal.trim();
        if(strVal.length === 0){
            throw `Error: ${varName} cannot be empty string`;
        }
        if(!isNaN(strVal)){
            throw `Error: ${strVal} is not a valid value for ${varName} because it only has numbers`;
        }
        return strVal;
    },

    checkStringArray(arr, varName){
        if(!arr || !Array.isArray(arr))
            throw `You must provide an array of ${varName};`
        for(let i in arr){
            if(typeof arr[i] !== 'string' || arr[i].trim().length === 0){
                throw `One or more elements in ${varName} array is not a string or is an empty string`;
            }
            arr[i] = arr[i].trim();
        }
        return arr;
    },
    checkRatingsAvg(ratingsAverageObj, varName){

        if(!ratingsAverageObj|| typeof ratingsAverageObj != 'object')
            throw `You must provide an array of ${varName}`;

        if(!ratingsAverageObj.overallAvg){
            throw 'missing overallAvg';
        }
        else if(typeof ratingsAverageObj.overallAvg != 'number' ){
            throw 'overallAvg must be a number';
        }

        if(!ratingsAverageObj.crowdednessAvg){
            throw 'missing crowdednessAvg';
        }
        else if(typeof ratingsAverageObj.crowdednessAvg != 'number' ){
            throw 'crowdednessAvg must be a number';
        }

        if(!ratingsAverageObj.cleanlinessAvg){
            throw 'missing cleanlinessAvg';
        }
        else if(typeof ratingsAverageObj.cleanlinessAvg != 'number' ){
            throw 'cleanlinessAvg must be a number';
        }

        if(!ratingsAverageObj.priceAvg){
            throw 'missing priceAvg';
        }
        else if(typeof ratingsAverageObj.priceAvg != 'number' ){
            throw 'priceAvg must be a number';
        }
        return ratingsAverageObj;
    },
    checkRating(rating, varName){
        if(!rating) throw `Error: missing ${varName}`;
        if(typeof rating != 'number') throw `Error: ${varName} must be of type number`;
        if(rating < 1 || rating > 5) throw `Error: ${varName} must be between 1 and 5`;
        return rating;
    },
    checkOverallRating(rating, varName){
        if(!rating) throw `Error: missing ${varName}`;
        if(typeof rating != 'number') throw `Error: ${varName} must be of type number`;
        if(rating < 1 || rating > 10) throw `Error: ${varName} must be between 1 and 10`;
        return rating;
    }
    
};

export default exportedMethods;