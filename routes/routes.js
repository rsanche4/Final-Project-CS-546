// THIS DOCUMENT IS BEING ACTIVELY REVIEWED AND UPDATED BY RAFAEL SANCHEZ
// DONT ANY OF YOU DARE TOUCH ANYTHING IN HERE.
// IF YOU CHANGE ANYTHING LET ME KNOW OR WE GON RUN HANDS CUH ON GOD NO CAP FR 
import {Router} from 'express';
import helpers from '../helpers.js'
import { ObjectId } from 'mongodb';
import { barData, ratingData, commentData } from '../data/index.js';

const router = Router();

router.route('/').get(async (req, res) => {
  try {
    res.redirect('/homepage');
  } catch (e) {
    res.status(500).json({error: e});
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
      let avg_score = (bar.ratingsAverage.overallAvg/2 + bar.ratingsAverage.crowdednessAvg + bar.ratingsAverage.cleanlinessAvg + bar.ratingsAverage.priceAvg)/4
      
      let number_of_ratings = 0
      allRatings.forEach(rating => { // double check id check todo
          if (rating.barId.toString() === bar._id.toString()) {
            number_of_ratings++
          }
      });
      
      let p = avg_score
      let q = number_of_ratings
      let Q = 100
      let relevance_score = 5*p/10 + 5*(1-Math.E-q/Q)
      // Source: https://math.stackexchange.com/questions/942738/algorithm-to-calculate-rating-based-on-multiple-reviews-using-both-review-score

      bar.relevance_score = relevance_score
      featured_bars.push(bar)

    });

    featured_bars.sort( helpers.compare_relevance_score );

    featured_bars = featured_bars.slice(0, 20)

    res.render('homepage', {
      featBars: featured_bars
    });
  } catch (e) {
    res.status(500).json({error: e});
  }

});

  router
  .route('/searchbars') // will be using barData.getAllBars() as well but now you display all the bars. 
  .get(async (req, res) => {
    try { 
      let allBars = await barData.getAllBars()
      res.render('searchBars', {
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
    if (req.body.searchVenueTerm.trim().length===0) {
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

      if (found_matching_bars.length>0) {
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
      message: 'WORKING ON ERROR MESSAGES TO DISPLAY HERE'
    });
}).post(async (req, res) => {
  // Not implemented
  res.status(403).render('error', {
    message: 'WORKING ON ERROR MESSAGES TO DISPLAY HERE'
  });
});

  router
  .route('/searchbars/:id') // this route displays each bar according to its id, and you will get info on the bar like picture, ratings, comments, everything
  .get(async (req, res) => {
    try {
      const r = {
        "TEST": "INDIVIDUAL BAR PAGE",
      }
      res.json(r);
    } catch (e) {
      // Something went wrong with the server!
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => { // HERE IN THE POST USERS WILL LEAVE THEIR COMMENTS, RATINGS ETC
    // Not implemented
    res.send('POST request to http://localhost:3000/bars/:id');
  })
  .delete(async (req, res) => {
    // Not implemented
    res.send('DELETE request to http://localhost:3000/bars/:id');
  });



export default router;
