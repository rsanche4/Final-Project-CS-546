import { Router } from 'express';
import helpers from '../helpers.js'
import { ObjectId } from 'mongodb';
import { barData, ratingData } from '../data/index.js';

import { getCommentsByBarID, addComment, updateComment, updateCommentPatch } from "../data/comments.js"

const apikey = 'AIzaSyC1fYCYIWM0-rXLca-5H3QtBsAccEtYvCE';

const router = Router();

router.route('/').get(async (req, res) => {
  try {
    res.redirect('/homepage');
  } catch (e) {
    res.status(500).json({ error: e });
  }

});

router.route('/homepage').get(async (req, res) => {
  //code here for GET
  try {
    let allBars = await barData.getAllBars() //(only featured bars, so only a few, not all the bars. Get them by their rating etc do the caluclation)

    // we need the number of reviews
    let allRatings = await ratingData.getAllRatings() // here we got all the ratings

    let featured_bars = []

    allBars.forEach(bar => {
      let avg_score = (bar.ratingsAverage.overallAvg / 2 + bar.ratingsAverage.crowdednessAvg + bar.ratingsAverage.cleanlinessAvg + bar.ratingsAverage.priceAvg + bar.ratingsAverage.waittimeAvg) / 4

      let number_of_ratings = 0
      allRatings.forEach(rating => { // double check id check todo
        if (rating.barId.toString() === bar._id.toString()) {
          number_of_ratings++
        }
      });

      let p = avg_score
      let q = number_of_ratings
      let Q = 100
      let relevance_score = 5 * p / 10 + 5 * (1 - Math.E - q / Q)
      // Source: https://math.stackexchange.com/questions/942738/algorithm-to-calculate-rating-based-on-multiple-reviews-using-both-review-score

      bar.relevance_score = relevance_score
      featured_bars.push(bar)

    });

    featured_bars = featured_bars.sort(helpers.compare_relevance_score);

    featured_bars = featured_bars.slice(0, 20)

    res.render('homepage', {
      featBars: featured_bars
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }

});

router
  .route('/searchbars') // will be using barData.getAllBars() as well but now you display all the bars. 
  .get(async (req, res) => {
    try {
      let allBars = await barData.getAllBars()
      let admin = false
        if (req.session.user && req.session.user.role === "admin") {
          admin = true
        }
      
      res.render('searchBars', {
        isAdmin: admin,
        allBars: allBars
      });


    } catch (e) {
      // Something went wrong with the server!
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => { // ALSO in this route you will show in the POST the bars again, but now only those according to the Servenueterm passed to this function. So search them based on their term using the getAllbars functions. You could create helper functions for this task
    // Not implemented
    if (!req.body.searchVenueTerm) {
      res.status(400).render('error', {
        message: 'Error 400: User did not input any text.'
      })
      return
    }
    if (req.body.searchVenueTerm.trim().length === 0) {
      res.status(400).render('error', {
        message: 'Error 400: User did not input any text.',
      })
      return
    }
    try {
      let term = req.body.searchVenueTerm.trim().toLowerCase()

      let allBars = await barData.getAllBars()

      let found_matching_bars = []

      allBars.forEach(bar => {
        if (bar.name.toLowerCase().includes(term)) {
          found_matching_bars.push(bar)
        }
      });

      if (found_matching_bars.length > 0) {
        res.render('searchBars', {
          allBars: found_matching_bars,
          NotFoundMessage: ""
        });
      } else {
        res.render('searchBars', {
          allBars: found_matching_bars,
          NotFoundMessage: "Could not find any matching bars."
        });
      }


    } catch (e) {
      console.log(e)
      res.status(500).render('error', {
        message: 'Error 500: Something went wrong.'
      })
    }
  })

router.route('/error').get(async (req, res) => { // regular error. not much new here
  res.status(403).render('error', {
    message: 'You have to be logged in to submit ratings info...'
  });
}).post(async (req, res) => {
  // Not implemented
  res.status(403).render('error', {
    message: 'ERROR 403'
  });
});

router
  .route('/searchbars/:id') 
  .get(async (req, res) => {
    try {
      let bar = await barData.getBarById(req.params.id);


        let admin = false
        if (req.session.user && req.session.user.role === "admin") {
          admin = true
        }

        let rated_bar_already = false
        // before adding the rating check if user's id shows up in any ratings with that barid
        let isLog = false
        if (req.session.user) {
          isLog = true
          let prevallRatings = await ratingData.getAllRatings()
          prevallRatings.forEach(rating => {
            if (rating.barId.toString() === req.params.id) {
              if (rating.userId.toString()=== req.session.user.id) {
                rated_bar_already = true
              }
            }
          });
        }
       
      let map = `${bar.name.split(' ').join('+')},Hoboken+NJ`;
      map = map.replace("'", '')
      map = map.replace('&', 'and')

      let waittime_string = ''
      if (bar.ratingsAverage.waittimeAvg > 0 && bar.ratingsAverage.waittimeAvg <= 1) {
        waittime_string = 'More than 1 hour'
      } else if (bar.ratingsAverage.waittimeAvg > 1 && bar.ratingsAverage.waittimeAvg <= 2) {
        waittime_string = 'Approximately 45 minutes'
      }else if (bar.ratingsAverage.waittimeAvg > 2 && bar.ratingsAverage.waittimeAvg <= 3) {
        waittime_string = 'Approximately 30 minutes'
      }else if (bar.ratingsAverage.waittimeAvg > 3 && bar.ratingsAverage.waittimeAvg <= 4) {
        waittime_string = 'Less than 10 minutes'
      }else if (bar.ratingsAverage.waittimeAvg > 4 && bar.ratingsAverage.waittimeAvg <= 5) {
        waittime_string = 'Less than 5 minutes'
      }

      console.log("t1: "+bar.ratingsAverage.overallAvg);
      console.log("t2: "+bar.ratingsAverage);
      console.log("t1: "+bar["ratingsAverage"]);
      res.render('barpage', {

          id: req.params.id,
          name: bar.name,
          picture: bar.picture,
          ratingsAverage_overallAvg: bar.ratingsAverage.overallAvg,
          ratingsAverage_crowdednessAvg: bar.ratingsAverage.crowdednessAvg,
          ratingsAverage_cleanlinessAvg: bar.ratingsAverage.cleanlinessAvg,
          ratingsAverage_priceAvg: bar.ratingsAverage.priceAvg,
          ratingsAverage_waitAvg: waittime_string,
          location: bar.location,
          description: bar.description,
          didRateAlready: rated_bar_already,
          apikey: apikey,
          mapLocation: map,
          isAdmin: admin,
          isLogged: isLog
        });


    } catch (e) {
      // Something went wrong with the server!
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => { // HERE IN THE POST USERS WILL LEAVE THEIR RATINGS. (comments are submitted using Ajax. Currently not implemented as Kristy will implement that)
    try {
      
      if (req.session.user) {
        let rated_bar_already = false
        // before adding the rating check if user's id shows up in any ratings with that barid
        let prevallRatings = await ratingData.getAllRatings()
        let rating_id = ''
        prevallRatings.forEach(rating => {
          if (rating.barId.toString() === req.params.id) {
            if (rating.userId.toString()=== req.session.user.id) {
              rated_bar_already = true
              rating_id = rating._id.toString() // Not sure if id is like this actually
            }
          }
        });
        
        if (rated_bar_already) {
          let updated_rating = await ratingData.getRatingById(rating_id)
          
          updated_rating.overall = Number(req.body.ratingsAverage_overallAvg)
          updated_rating.crowdedness = Number(req.body.ratingsAverage_crowdednessAvg)
          updated_rating.cleanliness = Number(req.body.ratingsAverage_cleanlinessAvg)
          updated_rating.price = Number(req.body.ratingsAverage_priceAvg)
          updated_rating.waittime = Number(req.body.ratingsAverage_waitAvg)
          let updating_rating = await ratingData.updateRatingPatch(rating_id, updated_rating)  
        
          
        } else {
          let submitting_rating = await ratingData.addRating(req.params.id, Number(req.body.ratingsAverage_overallAvg), Number(req.body.ratingsAverage_crowdednessAvg), Number(req.body.ratingsAverage_cleanlinessAvg), Number(req.body.ratingsAverage_priceAvg), req.session.user.id, Number(req.body.ratingsAverage_waitAvg))
        }

        

        let bar = await barData.getBarById(req.params.id)

        let allRatings = await ratingData.getAllRatings()

        let overall_arr = []
        let crowd_arr = []
        let clean_arr = []
        let price_arr = []
        let wait_arr = []

        allRatings.forEach(rating => {
          if (rating.barId.toString() === req.params.id) {
            overall_arr.push(rating.overall)
            crowd_arr.push(rating.crowdedness)
            clean_arr.push(rating.cleanliness)
            price_arr.push(rating.price)
            wait_arr.push(rating.waittime)

          }
        });

        bar.ratingsAverage.overallAvg = helpers.average(overall_arr)
        bar.ratingsAverage.crowdednessAvg = helpers.average(crowd_arr)
        bar.ratingsAverage.cleanlinessAvg = helpers.average(clean_arr)
        bar.ratingsAverage.priceAvg = helpers.average(price_arr)
        bar.ratingsAverage.waittimeAvg = helpers.average(wait_arr)

        let updated_bar = await barData.updateBarPatch(req.params.id, bar)

        res.redirect('/searchbars/' + req.params.id)
      } else {
        return res.redirect('/error');
      }

    } catch (e) {
      res.status(403).render('error', {
        message: e
      });
    }

  })
  .delete(async (req, res) => {
    // Not implemented
    res.send('DELETE request to http://localhost:3000/bars/:id');
  });

// JSON api endpoint for getting and posting comments by bar ID
// can use addComment(barId, userId, time, content) and getCommentsByBarID(barId)
//   comments in format
//   let newComment = {
//     barId:barId,
//     userId: userId,
//     time: time,
//     content: content
// };

router
  .route('/comments/:barId')
  .get(async (req, res) => {
    try {
      let comments = await getCommentsByBarID(req.params.barId)
      res.json(comments)
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(403).json({ error: 'You must be logged in to post a comment' });
      }
      if (!req.body.content) {
        return res.status(400).json({ error: 'You must provide content' });
      }
      //if someone already posted a comment, edit comment content
      let comments = await getCommentsByBarID(req.params.barId)
      let userComment = comments.filter(comment => comment.userId === req.session.user.id)

      console.log(userComment)
      console.log(req.session.user.id)
      if (userComment.length > 0) {
        userComment[0].content = req.body.content
        let comment = await updateCommentPatch(userComment[0]._id.toString(), userComment[0])
        
        return res.json(comment)
      }
      

      let newComment = {
        barId: req.params.barId,
        userId: req.session.user.id,
        time: new Date(),
        content: req.body.content
      }
      let comment = await addComment(newComment)
      res.json(comment)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e });
    }
  });



  router
  .route('/update/:id') 
  .get(async (req, res) => {
    let bar = await barData.getBarById(req.params.id)
    
    res.render('updateBar', {
      id: req.params.id,
      title: 'Update Listing',
      name: bar.name,
      image: bar.picture,
      barAddress: bar.location,
      description: bar.description
    })
  })
  .post(async (req, res) => {
    let update = req.body;
    let id = req.params.id;


     try {
  
      id = helpers.checkId(id, 'barID');
      const updateName = helpers.checkString(update.updateName, 'barName');
      const updateAddress = helpers.checkString(update.updateAddress, 'barLocation');
      const updateDesc = helpers.checkString(update.updateDesc, 'barDescription');
      const updateImage = helpers.checkString(update.updateImage, 'barPicture');
    
      let updated = {
        name: updateName,
            location: updateAddress,
            description: updateDesc,
            comments: [],
            ratingsAverage: {
                overallAvg: 0,
                crowdednessAvg: 0,
                cleanlinessAvg: 0,
                priceAvg: 0,
                waittimeAvg: 0
            },
            picture: updateImage
      }; 
      const updateBar = await barData.updateBarPatch(id, updated);
      res.redirect('/searchbars/'+id);
    } catch (e) {
      // Something went wrong with the server!
      console.log(e)
      res.status(500).send(e);
    }
  });

  router
  .route('/create')
  .get(async (req, res) => {
    res.render('addBar', {title: 'Add Bar Listing'});
  })
  .post(async (req, res) => { 
    try {
    let create = req.body;
    const addName = helpers.checkString(create.addName, 'barName');
    const addAddress = helpers.checkString(create.addAddress, 'barLocation');
    const addDesc = helpers.checkString(create.addDesc, 'barDescription');
    const addImage = helpers.checkString(create.addImage, 'barPicture');

  
      const newBar = await barData.addBar(addName, addAddress, addDesc, addImage);
      res.redirect('/searchbars/'+newBar._id.toString());

    } catch (e) {
      console.log(e)
      // Something went wrong with the server!
      res.status(500).send(e);
    }
  });


  router
  .route('/delete/:id')
  .get(async (req, res) => {
    console.log("NOT SUPPOSED TO BE HERE")
    
  })
  .post(async (req, res) => { 
    try {
      let deleting_bar = await barData.removeBar(req.params.id)
      res.redirect('/searchbars')
    } catch (e) {
      console.log(e)
    }
  });


export default router;
