import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} userId - The id of the author of the freet
   * @param {string} freetId - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      userId,
      freetId
    });
    await like.save(); // Saves freet to MongoDB
    return like.populate(['userId', 'freetId']);
  }

  /**
   * Find a like by freetId and userId
   *
   * @param {string} userId - The id of the author to find
   * @param {string} freetId - The id of the freet to find
   *
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({userId, freetId}).populate(['userId', 'freetId']);
  }

  /**
   * Get all the likes with a given freetId
   *
   * @param {string} freetId - the freetId that we want to find likes for
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllLikesByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freetId});
  }

  /**
   * Delete a like with given userId and freetId.
   *
   * @param {string} userId - The freetId of freet to delete
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({userId, freetId});
    return like !== null;
  }
}

export default LikeCollection;
