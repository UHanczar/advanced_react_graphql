const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if we are logged in.

    const item = await ctx.db.mutation.createItem(
      { data: { ...args } },
      info
    );

    console.log('ITEM', item);

    return item;
  }
};

module.exports = Mutations;
