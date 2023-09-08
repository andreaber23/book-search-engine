const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
          if (context.user) {
            const userData = await User
            .findOne({ _id: context.user._id })
            .select("-__v -password")
            .populate("books");
    
            return userData;
          }
          throw new AuthenticationError("Not logged in");
        },
      },

    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) throw new Error("Can't find this user");
      
            if (!(await user.isCorrectPassword(password))) 
            throw new Error('Wrong password!');
            return { token: signToken(user), user };
          },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { savedBooks: args.input } },
              { new: true }
            );
            return updatedUser;
          }
          throw new AuthenticationError("You need to be logged in!");
        },

        removeBook: async (_, { bookId }, context) => {
            return await User.findOneAndUpdate(
              context.user._id,
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            ).populate('savedBooks');
          },
      }, 
};

module.exports = resolvers;