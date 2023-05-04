import { Router } from 'express';
const router = Router();
import { createUser, checkUser } from "../data/users.js"
import * as check from "../helpers.js";

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.status(404).json({ message: 'You shouldnt be here' })
});

router
  .route('/register')
  .get(async (req, res) => {
    return res.render('register')
  })
  .post(async (req, res) => {
    try {
      const firstNameInput = check.validString(req.body.firstNameInput);
      const lastNameInput = check.validString(req.body.lastNameInput);
      const emailAddressInput = check.validEmail(req.body.emailAddressInput);
      const passwordInput = check.validPassword(req.body.passwordInput);
      let roleInput = check.validString(req.body.roleInput);
      if (passwordInput !== req.body.confirmPasswordInput) {
        throw new Error("Passwords do not match");
      }
      if (firstNameInput.length < 2 || firstNameInput.length > 25) {
        throw new Error("First name must be between 2 and 25 characters");
      }
      if (lastNameInput.length < 2 || lastNameInput.length > 25) {
        throw new Error("Last name must be between 2 and 25 characters");
      }
      if (["admin", "user"].indexOf(roleInput.toLowerCase()) < 0) {
        throw new Error("Role can only be either 'admin' or 'user'.")
      }
      roleInput = roleInput.toLowerCase();
      const newUser = await createUser(firstNameInput, lastNameInput, emailAddressInput, passwordInput, roleInput);
      if (newUser.insertedUser) {
        return res.redirect('/auth/login');
      }
      return res.status(500).json({ error: "Internal Server Error" });
    } catch (e) {
      res.status(400).render('register', { error: e.message })
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    return res.render('login')
  })
  .post(async (req, res) => {
    try {
      const emailAddressInput = check.validEmail(req.body.emailAddressInput);
      const passwordInput = check.validPassword(req.body.passwordInput);
      const user = await checkUser(emailAddressInput, passwordInput);
      //console.log(user);
      if (user) {
        req.session.user = { id: user._id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, role: user.role };
        if (user.role === "admin") {
          return res.redirect('/auth/admin');
        } else {
          return res.redirect('/auth/protected');
        }
      }
      if (!user) {
        throw new Error("Either the username or password is invalid");
      }
    } catch (e) {
      res.status(400).render('login', { error: e.message })
    }
  });

router.route('/protected').get(async (req, res) => {

  try{

    let admin = false
        if (req.session.user && req.session.user.role === "admin") {
          admin = true
        }

    return res.render('protected', { user: req.session.user, firstName: req.session.user.firstName, lastName: req.session.user.lastName, emailAddress: req.session.user.emailAddress, role: req.session.user.role, currentTime: new Date().toLocaleTimeString(), isAdmin: admin});

  } catch (e) {
    return res.status(404).json({ message: e });
  }
});

router.route('/admin').get(async (req, res) => {

  try{ // PAWAN DID THIS
    return res.render('admin', { user: req.session.user, firstName: req.session.user.firstName, lastName: req.session.user.lastName, emailAddress: req.session.user.emailAddress, role: req.session.user.role, currentTime: new Date().toLocaleTimeString()});

  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

router.route('/logout').get(async (req, res) => {
  try {
    req.session.destroy();
    return res.render('logout');
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

export const authRoutes = router;
export default router;