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
    const listItems = await strapi.services['to-watch'].find({
      'owner.id': ctx.state.user.id,
    });

    // strange bug, movieId is stored as string even if type is int
    return sanitizeEntity(listItems.map(item => {
      item.movieId = parseInt(item.movieId)
      return item
    }), { model: strapi.models['to-watch'] });
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
      entity = await strapi.services['to-watch'].create(data, { files });
    } else {
      ctx.request.body.owner = ctx.state.user.id;
      entity = await strapi.services['to-watch'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models['to-watch'] });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [listItem] = await strapi.services['to-watch'].find({
      id: ctx.params.id,
      'owner.id': ctx.state.user.id,
    });

    if (!listItem) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['to-watch'].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services['to-watch'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['to-watch'] });
  },
};