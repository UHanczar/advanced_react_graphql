const { forwardTo } = require('prisma-binding');

const { hasPermission } = require('../utils');

const Query = {
  async items(parent, args, ctx, info) {
    const items = await ctx.db.query.items({
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy,
    });

    return items;
  },
  // items: forwardTo('db'),

  item: forwardTo('db'),

  itemsConnection: forwardTo('db'),

  async user(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);

  },

  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in.');
    }

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in.');
    }

    const order = await ctx.db.query.order({
      where: { id: args.id }
    }, info);

    const ownsOrder = ctx.request.userId === order.user.id;
    const canSeeOrder = ctx.request.user.permissions.includes('ADMIN');

    if (!ownsOrder || !canSeeOrder) {
      throw new Error('You can not see this order!');
    }

    return order;
  },

  async orders(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in.');
    }

    return await ctx.db.query.orders({
      where: {
        user: { id: ctx.request.userId},
      }
    }, info);
  },
};

module.exports = Query;
