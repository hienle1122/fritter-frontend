import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!like) {
    res.status(403).json({
      error: {
        likeNotFound: `Like associated with user ID ${req.session.userId} and freet ID ${req.query.freetId} doesn't exists.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks to make sure that no like already exists for this user and tweet
 */
const noExistingLike = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (like) {
    res.status(403).json({
      error: {
        likeNotFound: `Like associated with user ID ${req.session.userId} and freet ID ${req.query.freetId} already exists.`
      }
    });
    return;
  }
  next();
};

export {
  isLikeExists,
  noExistingLike
};
