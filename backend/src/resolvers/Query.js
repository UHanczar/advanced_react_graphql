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
  }
};

module.exports = Query;
