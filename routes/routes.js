// THIS DOCUMENT IS BEING ACTIVELY REVIEWED AND UPDATED BY RAFAEL SANCHEZ
// DONT ANY OF YOU DARE TOUCH ANYTHING IN HERE.
// IF YOU CHANGE ANYTHING LET ME KNOW OR WE GON RUN HANDS CUH ON GOD NO CAP FR 
import {Router} from 'express';
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
    //let allBars = await barData.getAllBars() (only featured bars, so only a few, not all the bars. Get them by their rating etc do the caluclation)
    res.render('homepage', {

    });
  } catch (e) {
    res.status(500).json({error: e});
  }

});

  router
  .route('/searchbars') // will be using barData.getAllBars() as well but now you display all the bars. 
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
  .post(async (req, res) => { // ALSO in this route you will show in the POST the bars again, but now only those according to the Servenueterm passed to this function. So search them based on their term using the getAllbars functions. You could create helper functions for this task
    // Not implemented
    res.send('POST request to http://localhost:3000/bars/:id');
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
