
import {dbConnection} from './mongoConnection.js';

/* This will allow you to have one reference to each collection per app */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

//list collections here

export const bars = getCollectionFn('bars');
export const users = getCollectionFn('users');
export const ratings = getCollectionFn('ratings');
export const comments = getCollectionFn('comments');
