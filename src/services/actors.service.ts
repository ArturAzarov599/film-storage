import ActorModel from "@models/Actor.model";

import { IActor } from "@interfaces/actor.interface";
import sequelize from "@configuration/database";

class ActorService {
  static async createActors(names: IActor[]): Promise<ActorModel[]> {
    const transaction = await sequelize.transaction();
    try {
      const createdActorsPromise = names.map(async ({ name }) => {
        const [actor] = await ActorModel.findCreateFind({
          where: { name },
          defaults: { name },
        });

        return actor;
      });
      const createdActors = await Promise.all(createdActorsPromise);
      await transaction.commit();

      return createdActors;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default ActorService;
