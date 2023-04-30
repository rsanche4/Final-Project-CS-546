import barDataFunctions from './bars.js';
import userDataFunctions from './users.js';
import ratingDataFunctions from './ratings.js';
import commentDataFunctions from './comments.js';

export const barData = barDataFunctions;
// RAFAEL SANCHEZ COMMENTED THIS BECAUSE THIS ISN'T WORKING AS INTENDED. USE THE REGULAR FUNCTIONS CREATE USER AND CHECKUSER INSTEAD FOR NOW
//export const userData = userDataFunctions;
export const ratingData = ratingDataFunctions;
export const commentData = commentDataFunctions;