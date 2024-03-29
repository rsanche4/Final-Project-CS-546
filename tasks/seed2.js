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

/*const adminAccount = await createUser(
    'Patrick', 
    'Hill',
    'phill@stevens.edu',
    '123!@#QWEqwe',
    'admin'
    );
*/
const adminAccount = await users.addUser(
    'Patrick', 
    'Hill',
    'phill@stevens.edu',
    //"TheManWithThePlan",
    'Password123!@',
    'admin'
    );

const pid = adminAccount._id.toString();

const userAccount = await users.addUser(
    'Alfredo',
    'Mendez',
    'alfredo@stevens.edu',
    //"Alfredo69",
    'Test123!@',
    'user'
);

const userAccount2 = await users.addUser(
    "Pawan",
    "Perera",
    "pawan@minecraft.net",
    //"PawanP",
    "Test123!@",
    "user"
);

const barReviews = [
  "I don't always drink, but when I do, I prefer to do it here. The beer is so good that it could convince me to grow a beard.",
  "This bar has a great atmosphere! It's like Cheers, but instead of Norm, there's a guy named Storm who can really chug a beer.",
  "The drinks here are so strong, I'm pretty sure I could use them to clean my shower. But hey, at least they're delicious!",
  "I came for the drinks, but I stayed for the company. The bartenders are so friendly that I'm pretty sure they could make friends with a cactus.",
  "This bar is so cool that it's like stepping into a time machine. The only difference is that instead of going back in time, you end up in a room with a bunch of people who know how to party.",
  "The drinks here are like a work of art. They're so beautiful that I almost don't want to drink them... almost.",
  "I've been to a lot of bars in my life, but this one is definitely one of the top 10 bars I've been to this week.",
  "The only thing better than the drinks here is the karaoke. If you want to hear a grown man sing 'I Will Survive,' this is the place to be.",
  "I don't always dance, but when I do, it's at this bar. The music is so good that it's like a magnet for my feet.",
  "This bar is like a warm hug in the form of a building. The only difference is that instead of a hug, you get a cocktail.",
  "This bar is tremendous. Believe me, it's got the best drinks. The bartenders are winners, just like me. They know how to make a bar great again.",
  "I've been to a lot of bars, and let me tell you, this one is fantastic. The atmosphere is yuge and the service is top-notch. It's a total winner!",
  "The drinks at this bar are tremendous. Nobody makes drinks like they do here. You won't find better drinks anywhere else, folks. It's just incredible.",
  "I've seen a lot of bars in my time, but this one is a real gem. The cocktails are so good, it'll make your head spin. Nobody does it better than this bar. Nobody!",
  "This bar is a total success. The drinks are like a beautiful piece of art. You'll be blown away by the flavors. It's a tremendous experience.",
  "When it comes to bars, this one is a total winner. The staff is incredible. They're smart, they're talented, and they know how to make a bar great. You'll love it.",
  "I've been saying it for years: this bar is tremendous. The drinks are the best. It's like winning the lottery. You've got to check it out.",
  "This bar is like a dream come true. The drinks are out of this world. You won't believe how good they are. It's just tremendous.",
  "I've been to many bars, but this one is in a league of its own. The atmosphere is incredible. It's like a five-star hotel. You'll feel like a million bucks.",
  "Let me tell you, this bar is fantastic. The drinks are incredible. It's like being in paradise. You won't want to leave.",
  "This bar is a total winner. The drinks are so good, it's like magic. It's just tremendous. You'll be amazed.",
  "I've seen a lot of bars in my life, but this one is something special. The drinks are tremendous. You won't find better anywhere else.",
  "Believe me, this bar is amazing. The drinks are top-notch. You won't be disappointed. It's just fantastic.",
  "I've been to bars all over the world, and this one is the best. The drinks are incredible. You won't believe how good they are.",
  "This bar is a total success. The drinks are tremendous. It's like hitting a hole in one. You've got to try it.",
  "Let me tell you, this bar is tremendous. The drinks are like gold. You won't find better anywhere else. It's just fantastic.",
  "I've been to many bars, but this one is on another level. The drinks are incredible. It's like winning the lottery. You'll love it.",
  "This bar is a total winner. The drinks are so good, it's like magic. You won't believe it. It's just tremendous.",
  "I've seen a lot of bars in my time, but this one is something special. The drinks are tremendous. You won't find better anywhere else.",
  "Believe me, this bar is amazing. The drinks are top-notch. It's like being in heaven. You won't be disappointed."
];

const amid = userAccount._id.toString();
const ppid = userAccount2._id.toString();
let barIds =[];
let userIds =[];
//let revIds = [];
userIds.push(amid);
userIds.push(ppid);


const mcswiggans = await bars.addBar(
    "McSwiggan's Pub",
    "110 1st St, Hoboken, NJ 07030",
    "Great Bar with great atmosphere. You will love your time here!",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://lh3.googleusercontent.com/p/AF1QipMHbsKfiNwWMjTWXRKziRkou2ufSi9YIT-xvBR-=s1360-w1360-h1020"
    
);

const mcswiggansID = mcswiggans._id.toString();
barIds.push(mcswiggansID);

const madison  = await bars.addBar(
    "The Madison Bar & Grill",
    "1316 Washington St, Hoboken, NJ 07030",
    "New American fare & drink specials in a roadhouse-style space that's bustling on weekends.",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://lh3.googleusercontent.com/p/AF1QipMI7uuOE2E4syOiPtrfsaDCt7UiO00iX6hfM2Jq=s1360-w1360-h1020"

);

const madisonID = madison._id.toString();
barIds.push(madisonID);

const shepherd = await bars.addBar(
    "The Shepherd & the Knucklehead of Hoboken",
    "1313 Willow Ave, Hoboken, NJ 07030",
    "Craft beer & elevated pub fare including brunch, dished up in a funky tavern setting with TV sports.",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://resizer.otstatic.com/v2/photos/wide-huge/2/41720533.jpg"
);

const shepherdID = shepherd._id.toString();
barIds.push(shepherdID);

const mikie = await bars.addBar(
    "Mikie Squared Bar & Grill",
    "616 Washington St, Hoboken, NJ 07030",
    "This casual, patio-fronted sports bar boasts an extensive menu of burgers, sandwiches & entrees.",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://lh3.googleusercontent.com/p/AF1QipPn0MbWGr-JOcqkMJMR7QhiT-bN_MeL30gS8nxN=s1360-w1360-h1020"


);

const mikieID = mikie._id.toString();
barIds.push(mikieID);

const eigth = await bars.addBar(
    "8th Street Tavern",
    "800 Washington St, Hoboken, NJ 07030",
    "Great Bar, Great times, Great Drinks, Great Food = Great Nights!",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://lh3.googleusercontent.com/p/AF1QipPDUbYyjZO7yJeTl3yPA_1rMHpSW2CxgJ2bk6Li=s1360-w1360-h1020"

);

const eigthID = eigth._id.toString();
barIds.push(eigthID);

const madd = await bars.addBar(
    "Madd Hatter Hoboken",
    "221 Washington St, Hoboken, NJ 07030",
    "Loud, lively hangout featurig 40+ TVs for sports, a huge beer selection & comfort food favorites.",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://lh3.googleusercontent.com/p/AF1QipNULo-nuYdGMBLT94OA5RK90zoCYPKmdFEShfJ9=s1360-w1360-h1020"
);

const maddID = madd._id.toString();
barIds.push(maddID);

const wicked = await bars.addBar(
    "Wicked Wolf Tavern",
    "120 Sinatra Dr, Hoboken, NJ 07030",
    "Casual sports bar offering plentiful TVs, pub grub & outdoor riverside seating, plus bands & DJs",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://www.skyviewpros.com/wp-content/uploads/2012/09/wicked1.jpg"
);

const wickedID = wicked._id.toString();
barIds.push(wickedID);

const farside = await bars.addBar(
    "Farside Tavern",
    "531 Washington St, Hoboken, NJ 07030",
    "Laid-back local tavern offering American grub, a full bar, a dartboard, a back patio & sports on TV",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://lh3.googleusercontent.com/p/AF1QipNaJyhlSrvGC_O6zitgREaJJgPhtGCfgpwVAX4q=s1360-w1360-h1020"

);

const farsideID = farside._id.toString();
barIds.push(farsideID);

const louise = await bars.addBar(
    "Louise & Jerry's",
    "329 Washington St, Hoboken, NJ 07030",
    "Beer, cocktails & bar bites served in a relaxed watering hole with a pool table & jukebox",
    //"https://static.wikia.nocookie.net/elderscrolls/images/b/b1/Four_Shields_Tavern.jpg/revision/latest?cb=20140502235035"
    "https://fastly.4sqi.net/img/general/600x600/0DGBPDTDKDNG1I40RQ531CGM1ZANEMS24H0SHQ4GHDLBXM2O.jpg"
);

const louiseID = louise._id.toString();
barIds.push(louiseID);

const mulligans = await bars.addBar(
    "Mulligan's Pub",
    "159 1st St, Hoboken, NJ 07030",
    "Bustling, classic Irish bar for game day featuring a pool table, small ppub menu & draft beer.",
//    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.architecturaldigest.com%2Fgallery%2Fbest-designed-bar-each-state&psig=AOvVaw1f-QjCFM1_qcN2s5sstGIK&ust=1683676244972000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCNif9_f05v4CFQAAAAAdAAAAABAD"
    "https://www.hoboken-bar.net/wp-content/uploads/2018/03/mul-ph3.jpg"
);

const mulligansID = mulligans._id.toString();
barIds.push(mulligansID);

const shannon = await bars.addBar(
    "The Shannon",
    "106 1st St, Hoboken, NJ 07030",
    "TV-lined Irish sports bar that fills up on weekends with fresh-out-of-college types.",
    "https://www.skyviewpros.com/wp-content/uploads/2012/09/shannon4.jpg"

)

const shannonID = shannon._id.toString();
barIds.push(shannonID);

const belo = await bars.addBar(
    "Belo Bar & kitched",
    "104 Hudson St, Hoboken, NJ 07030",
    "Concicial haunt featuring Irish pub grub & a large beer list, plus a fireplace & outdoor seating.",
    "https://lh3.googleusercontent.com/p/AF1QipPa2xeiUgw-LY1LT_YkxV7vumlDsfUt7ss6xeOG=s1360-w1360-h1020"
);
const beloID = belo._id.toString();
barIds.push(beloID);

const carpe = await bars.addBar(
    "Carpe Diem",
    "1405 Grand St, Hoboken, NJ 07030",
    "This bar is awesome bro, trust me",
    "https://media-cdn.tripadvisor.com/media/photo-s/04/a1/cb/25/nice-bar.jpg"
);

const carpeID = carpe._id.toString();
barIds.push(carpeID);

const cork = await bars.addBar(
    "Cork City Pub",
    "239 Bloomfield St, Hoboken, NJ 07030",
    "Old-school speakeasy offering some 150 varieties of beer in bottles & on tap plus frequent tastings.",
    "https://lh5.googleusercontent.com/p/AF1QipPD6jQyBZH6aDWVUenndY0obEINCdgKBEycY8Iz=w800-h500-k-no"
);

const corkID = cork._id.toString();
barIds.push(corkID);

const ferry = await bars.addBar(
    "The Ferryman On 1st Hoboken",
    "94-98 Bloomfield St, Hoboken, NJ 07030",
    "This bar is better than all the other bars",
    "https://www.nj.com/resizer/otxUF_3obu3USvSneQwxh2KznyY=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/KXUQ7U4YCNCJ7IP64SXK7SMIRU.jpg"
);

const ferryID = ferry._id.toString();
barIds.push(ferryID);

const gmar = function(max) {
    if(max != 10 && max != 5) max = 5;
    return (Math.floor(Math.random()*max)) + 1;
};

const gmauid = function() {
    let max = userIds.length;
    let ruIdx =  Math.floor(Math.random()*max) ;
    return userIds[ruIdx];
};

const gmabid = function() {
    let max = barIds.length;
    let rbIdx = Math.floor(Math.random()*max) ;
    return barIds[rbIdx];
};

const gmanor = function() {
    let max = 50;
    return Math.floor(Math.random()*max)+50 ;
};

const gmanoc = function() {
    let max = 25;
    return Math.floor(Math.random()*max)+25 ;
};

const gmac = function() {
    let max = barReviews.length;
    let rcIdx = Math.floor(Math.random()*max) ;
    return barReviews[rcIdx] ;
};
//4 ratings per bar
/*
for(let i = 0; i < barIds.length; i++){
    for(let j = 0; j < 4; j++){
    await ratings.addRatings(barIds[i], gmar(10), gmar(5), gmar(5), gmar(5),gmauid());
    }
}*/

//50-100 ratings to RANDOM bars
/*
let numOfRatings = gmanor();
for(let i = 0; i < numOfRatings; i++){
    await ratings.addRating(gmabid(), gmar(10), gmar(5), gmar(5), gmar(5), gmauid());
}*/

for(let i = 0; i < barIds.length; i++){
    for( let j = 0; j < userIds.length;j++){
        await ratings.addRating(
            barIds[i], gmar(10), gmar(5), gmar(5), gmar(5), userIds[j], gmar(5) 
        );
    }
}

//25-50 reviews to RANDOM bars by RANDOM users
/*
let numOfComments = gmanoc();
for(let i = 0; i < numOfComments; i++){
    //maybe just get the current time in the helpers
    await addComment(gmabid(), gmauid(), "temp date string", gmac());
}
*/

for(let i = 0; i < barIds.length; i++){
    for(let j = 0; j < userIds.length; j++){
        await addComment(barIds[i], userIds[j], new Date(), gmac());
    }
}

console.log("done seeding database");

await closeConnection();