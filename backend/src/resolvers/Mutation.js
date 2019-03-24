const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { hasPermission } = require('../utils');
const { formatEmail, transport } = require('../../src/mail');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const item = await ctx.db.mutation.createItem(
      { data: {
        ...args,
        user: {
          connect: {
            id: ctx.request.userId,
          }
        }
      } },
      info
    );

    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };

    delete updates.id;
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id,
      }
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    const item = await ctx.db.query.item({ where }, `{ id, title user { id }}`);
    const itemOwner = item.user.id === ctx.request.userId;
    const permissionsAvailable = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

    if (!itemOwner || !permissionsAvailable) {
      throw new Error('You do not have permission to delete this item!');
    }

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await  bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        email,
        permissions: {
          set: ['USER']
        }
      }
    }, info);

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },

  async signin(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email }});

    if (!user) {
      throw new Error(`No such user was found for email ${args.email}`);
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
      throw new Error(`Invalid password for email ${args.email}`);
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');

    return {
      message: 'Goodbye!',
    }
  },

  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email }});

    if (!user) {
      throw new Error(`No such user was found for email ${args.email}`);
    }

    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    const res = await ctx.db.mutation.updateUser({
      where: {
        email: args.email,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const mailResponse = await transport.sendMail({
      from: 'u.hanczar@gmail.com',
      to: user.email,
      subject: 'Your password reset',
      html: formatEmail(`Go to <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here</a> to reset your token.`),
    });

    return {
      message: 'Success',
    }
  },

  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error('You passwords do not match.');
    }

    const [ user ] = await ctx.db.query.users({ where: {
      resetToken: args.resetToken,
      resetTokenExpiry_gte: Date.now() - 3600000,
    }});

    if (!user) {
      throw new Error('This token is either invalid or expired.');
    }

    const password = await  bcrypt.hash(args.password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      }
    });

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    const user = await ctx.db.query.user({ where: { id: ctx.request.userId }}, info);

    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      },
    }, info);
  }
};

module.exports = Mutations;
