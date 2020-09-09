import User from "../../../models/User";
import { USER_ADDED } from "./channels";

export default {
  User: {
    fullName: (user) => `${user.firstName} ${user.lastName}`,
  },
  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findById(id),
  },
  Mutation: {
    createUser: async (_, { data }, { pubSub }) => {
      const user = await User.create(data);

      pubSub.publish(USER_ADDED, {
        userAdded: user,
      });

      return user;
    },
    updateUser: (_, { id, data }) =>
      User.findOneAndUpdate(id, data, { new: true }),
    deleteUser: async (_, { id }) => {
      const deleted = await User.findOneAndDelete(id);

      return !!deleted;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: (object, args, { pubSub }) => pubSub.asyncIterator(USER_ADDED),
    },
  },
};
