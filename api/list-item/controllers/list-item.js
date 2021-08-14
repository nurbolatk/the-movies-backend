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

    return sanitizeEntity(listItems, { model: strapi.models['list-item'] });
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
      'owner.id': ctx.state.user.id,
    });

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