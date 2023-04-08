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
    }
};

export default exportedMethods;