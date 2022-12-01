import type {HydratedDocument} from 'mongoose';
import type {dislike, Populateddislike} from '../dislike/model';

// Update this if you add a property to the dislike type!
type dislikeResponse = {
  _id: string;
  user: string;
  freetId: string;
};

/**
 * Transform a raw dislike object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<dislike>} dislike - A dislike
 * @returns {dislikeResponse} - The dislike object formatted for the frontend
 */
const constructdislikeResponse = (dislike: HydratedDocument<dislike>): dislikeResponse => {
  const dislikeCopy: Populateddislike = {
    ...dislike.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = dislikeCopy.userId;
  delete dislikeCopy.userId;
  return {
    ...dislikeCopy,
    _id: dislikeCopy._id.toString(),
    user: username,
    freetId: dislikeCopy.freetId._id.toString()
  };
};

export {
  constructdislikeResponse
};
