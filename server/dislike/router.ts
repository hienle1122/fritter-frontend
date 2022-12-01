import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import dislikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as dislikeValidator from '../dislike/middleware';
import * as util from './util';
import LikeCollection from '../like/collection';
import { Types } from 'mongoose';

const router = express.Router();

/**
 * Get number of dislikes on a Freet by freetId.
 *
 * @name GET /api/dislikes?freetId=id
 *
 * @return {dislikeResponse[]} - An array of dislikes associated with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    req.params.freetId = String(req.query.freetId);
    console.log(req.params);
    console.log(req.query);
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    res.status(400).json({
      error: {
        missingQueryField: 'Need to pass a freetID with this request.'
      }
    });
    return;
  },
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const numfreetdislikes = await dislikeCollection.findAlldislikesByFreetId(req.query.freetId as string);
    res.status(200).json({"dislikeCount": numfreetdislikes.length});
  }
);

/**
 * Delete a dislike
 *
 * @name DELETE /api/dislikes?freetId=id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    req.params.freetId = String(req.query.freetId);
    next();
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    dislikeValidator.isdislikeExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    await dislikeCollection.deleteOne(userId, req.query.freetId as string);
    res.status(200).json({
      message: 'Your dislike was deleted successfully.'
    });
  }
);

/**
 * Create a new dislike
 *
 * @name POST /api/dislikes
 *
 * @param {string} freetId - the freetId that we want to assign a dislike to
 * @return {dislikeResponse} - The created dislike
 * @throws {403} - If the user is not logged in
 */
router.post(
  
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // add to req.params for freet validator to work
    req.params.freetId = String(req.body.freetId);
    next();
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    dislikeValidator.noExistingdislike
  ],
  
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; 
    const dislike = await dislikeCollection.addOne(userId, req.body.freetId);
    const like = LikeCollection.findOne(userId, req.body.freetId as string);
    if (like) {
      console.log("here");
      const deleted = await LikeCollection.deleteOne(userId, req.body.freetId as string);
      if (deleted) {
        console.log("deleted");
      }
    }
    res.status(201).json({
      message: 'Your dislike was created successfully.',
      dislike: util.constructdislikeResponse(dislike)
    });
  }
);



export {router as dislikeRouter};
