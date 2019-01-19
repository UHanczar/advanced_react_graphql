const { forwardTo } = require('prisma-binding');

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
};

module.exports = Query;
