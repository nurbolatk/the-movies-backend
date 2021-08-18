'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async find(ctx) {
    const listItems = await strapi.services['list-item'].find({
      'owner.id': ctx.state.user.id,
    });
    // strange bug, movieId is stored as string even if type is int
    return sanitizeEntity(listItems.map(item => {
      item.movieId = parseInt(item.movieId)
      return item
    }), { model: strapi.models['list-item'] });
  },

  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      
      data.owner = ctx.state.user.id;
      entity = await strapi.services['list-item'].create(data, { files });
    } else {
      ctx.request.body.owner = ctx.state.user.id;
      entity = await strapi.services['list-item'].create(ctx.request.body);
      entity.movieId = parseInt(entity.movieId)
    }
    return sanitizeEntity(entity, { model: strapi.models['list-item'] });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [listItem] = await strapi.services['list-item'].find({
      id: ctx.params.id,
      // 'owner.id': ctx.state.user.id,
    });

    console.log(listItem)
    console.log("\n\n\n\n\n")
    console.log(ctx)

    if (!listItem) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['list-item'].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services['list-item'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['list-item'] });
  },
};