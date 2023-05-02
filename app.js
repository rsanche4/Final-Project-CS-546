
import express from 'express';
const app = express();
import configRoutesFunction from './routes/index.js';

import session from 'express-session';
import { middle1, middle2, middle3, middle4, middle5, middle6, middle7} from './middleware.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import exphbs from 'express-handlebars';

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    name : 'AuthCookie'
}));

app.use("/", middle1);
app.use("/auth/login", middle2);
app.use("/auth/register", middle3);
app.use("/auth/protected", middle4);
app.use("/auth/admin", middle5);
app.use("/auth/logout", middle6);
app.use(middle7);

//public
app.use("/public", express.static('public'));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});