"use strict";
/**
* Auth.js controller
*
* @description: A set of functions called "actions" for managing `Auth`.
*/
module.exports = {
  async getUserInfo(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      try {
        const { id } = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
          id,
        }, ['role']);
        
        const response = {id, username: user.username, email: user.email, role: user.role}
        console.log(response)
        ctx.send(response)
      } catch(err) {
        return handleErrors(ctx, err, 'unauthorized');
      }
    }  
  },
};