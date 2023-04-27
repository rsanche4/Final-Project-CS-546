
import {Router} from 'express';
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
    res.render('homepage');
  } catch (e) {
    res.status(500).json({error: e});
  }

});

  router
  .route('/searchbars')
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
  .post(async (req, res) => {
    // Not implemented
    res.send('POST request to http://localhost:3000/bars/:id');
  })

  router
  .route('/:id')
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
  .post(async (req, res) => {
    // Not implemented
    res.send('POST request to http://localhost:3000/bars/:id');
  })
  .delete(async (req, res) => {
    // Not implemented
    res.send('DELETE request to http://localhost:3000/bars/:id');
  });


export default router;
