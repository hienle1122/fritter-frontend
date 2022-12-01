import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import dislikeCollection from '../dislike/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isdislikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  const dislike = validFormat ? await dislikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!dislike) {
    res.status(403).json({
      error: {
        dislikeNotFound: `dislike associated with user ID ${req.session.userId} and freet ID ${req.query.freetId} doesn't exists.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks to make sure that no dislike already exists for this user and tweet
 */
const noExistingdislike = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const dislike = validFormat ? await dislikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (dislike) {
    res.status(403).json({
      error: {
        dislikeNotFound: `dislike associated with user ID ${req.session.userId} and freet ID ${req.query.freetId} already exists.`
      }
    });
    return;
  }
  next();
};

export {
  isdislikeExists,
  noExistingdislike
};
