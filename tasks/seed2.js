import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import users from '../data/users.js';
import bars from '../data/bars.js'
import ratings from '../data/ratings.js'
//import comments from '../data/comments.js'
import { addComment } from "../data/comments.js"
import { createUser } from "../data/users.js"
//import * as helpers from "../helpers.js"

const db = await dbConnection();
await db.dropDatabase();

const adminAccount = await createUser(
    'Patrick', 
    'Hill',
    'phill@stevens.edu',
    '123!@#QWEqwe',
    'admin'
    );

// const adminAccount = await users.addUser(
//     'Patrick', 
//     'Hill',
//     'phill@stevens.edu',
//     "TheManWithThePlan",
//     'Password123!@',
//     'admin'
//     );

// const pid = adminAccount._id.toString();

// const userAccount = await users.addUser(
//     'Alfredo',
//     'Mendez',
//     'alfredo@stevens.edu',
//     "Alfredo69",
//     'Test123!@',
//     'user'
// );

// const userAccount2 = await users.addUser(
//     "Pawan",
//     "Perera",
//     "pawan@minecraft.net",
//     "PawanP",
//     "Test123!@",
//     "user"
// );

// const barReviews = [
//   "I don't always drink, but when I do, I prefer to do it here. The beer is so good that it could convince me to grow a beard.",
//   "This bar has a great atmosphere! It's like Cheers, but instead of Norm, there's a guy named Storm who can really chug a beer.",
//   "The drinks here are so strong, I'm pretty sure I could use them to clean my shower. But hey, at least they're delicious!",
//   "I came for the drinks, but I stayed for the company. The bartenders are so friendly that I'm pretty sure they could make friends with a cactus.",
//   "This bar is so cool that it's like stepping into a time machine. The only difference is that instead of going back in time, you end up in a room with a bunch of people who know how to party.",
//   "The drinks here are like a work of art. They're so beautiful that I almost don't want to drink them... almost.",
//   "I've been to a lot of bars in my life, but this one is definitely one of the top 10 bars I've been to this week.",
//   "The only thing better than the drinks here is the karaoke. If you want to hear a grown man sing 'I Will Survive,' this is the place to be.",
//   "I don't always dance, but when I do, it's at this bar. The music is so good that it's like a magnet for my feet.",
//   "This bar is like a warm hug in the form of a building. The only difference is that instead of a hug, you get a cocktail."
// ];

// const amid = userAccount._id.toString();
// const ppid = userAccount2._id.toString();
// let barIds =[];
// let userIds =[];
// //let revIds = [];
// userIds.push(amid);
// userIds.push(ppid);


// const mcswiggans = await bars.addBar(
//     "McSwiggan's Pub",
//     "110 1st St, Hoboken, NJ 07030",
//     "Great Bar with great atmosphere. You will love your time here!",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const mcswiggansID = mcswiggans._id.toString();
// barIds.push(mcswiggansID);

// const madison  = await bars.addBar(
//     "The Madison Bar & Grill",
//     "1316 Washington St, Hoboken, NJ 07030",
//     "New American fare & drink specials in a roadhouse-style space that's bustling on weekends.",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const madisonID = madison._id.toString();
// barIds.push(madisonID);

// const shepherd = await bars.addBar(
//     "The Shepherd & the Knucklehead of Hoboken",
//     "1313 Willow Ave, Hoboken, NJ 07030",
//     "Craft beer & elevated pub fare including brunch, dished up in a funky tavern setting with TV sports.",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const shepherdID = shepherd._id.toString();
// barIds.push(shepherdID);

// const mikie = await bars.addBar(
//     "Mikie Squared Bar & Grill",
//     "616 Washington St, Hoboken, NJ 07030",
//     "This casual, patio-fronted sports bar boasts an extensive menu of burgers, sandwiches & entrees.",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const mikieID = mikie._id.toString();
// barIds.push(mikieID);

// const eigth = await bars.addBar(
//     "8th Street Tavern",
//     "800 Washington St, Hoboken, NJ 07030",
//     "Great Bar, Great times, Great Drinks, Great Food = Great Nights!",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const eigthID = eigth._id.toString();
// barIds.push(eigthID);

// const madd = await bars.addBar(
//     "Madd Hatter Hoboken",
//     "221 Washington St, Hoboken, NJ 07030",
//     "Loud, lively hangout featurig 40+ TVs for sports, a huge beer selection & comfort food favorites.",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const maddID = madd._id.toString();
// barIds.push(maddID);

// const wicked = await bars.addBar(
//     "Wicked Wolf Tavern",
//     "120 Sinatra Dr, Hoboken, NJ 07030",
//     "Casual sports bar offering plentiful TVs, pub grub & outdoor riverside seating, plus bands & DJs",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"

// );

// const wickedID = wicked._id.toString();
// barIds.push(wickedID);

// const farside = await bars.addBar(
//     "Farside Tavern",
//     "531 Washington St, Hoboken, NJ 07030",
//     "Laid-back local tavern offering American grub, a full bar, a dartboard, a back patio & sports on TV",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const farsideID = farside._id.toString();
// barIds.push(farsideID);

// const louise = await bars.addBar(
//     "Louise & Jerry's",
//     "329 Washington St, Hoboken, NJ 07030",
//     "Beer, cocktails & bar bites served in a relaxed watering hole with a pool table & jukebox",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const louiseID = louise._id.toString();
// barIds.push(louiseID);

// const mulligans = await bars.addBar(
//     "Mulligan's Pub",
//     "159 1st St, Hoboken, NJ 07030",
//     "Bustling, classic Irish bar for game day featuring a pool table, small ppub menu & draft beer.",
//     "https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
// );

// const mulligansID = mulligans._id.toString();
// barIds.push(mulligansID);

// const gmar = function(max) {
//     if(max != 10 && max != 5) max = 5;
//     return (Math.floor(Math.random()*max)) + 1;
// };

// const gmauid = function() {
//     let max = userIds.length;
//     let ruIdx =  Math.floor(Math.random()*max) ;
//     return userIds[ruIdx];
// };

// const gmabid = function() {
//     let max = barIds.length;
//     let rbIdx = Math.floor(Math.random()*max) ;
//     return barIds[rbIdx];
// };

// const gmanor = function() {
//     let max = 50;
//     return Math.floor(Math.random()*max)+50 ;
// };

// const gmanoc = function() {
//     let max = 25;
//     return Math.floor(Math.random()*max)+25 ;
// };

// const gmac = function() {
//     let max = barReviews.length;
//     let rcIdx = Math.floor(Math.random()*max) ;
//     return barReviews[rcIdx] ;
// };
// //4 ratings per bar
// /*
// for(let i = 0; i < barIds.length; i++){
//     for(let j = 0; j < 4; j++){
//     await ratings.addRatings(barIds[i], gmar(10), gmar(5), gmar(5), gmar(5),gmauid());
//     }
// }*/

// //50-100 ratings to RANDOM bars
// let numOfRatings = gmanor();
// for(let i = 0; i < numOfRatings; i++){
//     await ratings.addRating(gmabid(), gmar(10), gmar(5), gmar(5), gmar(5), gmauid());
// }

// //25-50 reviews to RANDOM bars by RANDOM users
// let numOfComments = gmanoc();
// for(let i = 0; i < numOfComments; i++){
//     //maybe just get the current time in the helpers
//     await addComment(gmabid(), gmauid(), "temp date string", gmac());
// }

// console.log("done seeding database");

await closeConnection();