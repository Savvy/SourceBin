const fs = require('fs');
const { Methods: { escapeHtml }, Converter: { convert } } = require('../utils')

module.exports = (router, limiters, { bins }) => {
  const profile = fs.readFileSync('./html/profile/account/index.html').toString();
  const noAccount = convert(fs.readFileSync('./html/profile/noaccount/index.html').toString(), {
    oauth2: require('../config.json').oauth2.uri
  });

  router.get('/profile', limiters.loadPage, async (res, data) => {
    if (data.user.username) {
      const bin = await bins.find({ id: data.user.id });

      return res.html(200, convert(profile, {
        username: escapeHtml(`${data.user.username}#${data.user.discriminator}`),
        id: data.user.id,
        avatar: `${data.user.id}/${data.user.avatar}.${data.user.avatar.startsWith('a_') ? 'gif' : 'png'}`,
        bins: `[${bin.map(bin => `'${bin.key}'`).join(',')}]`
      }));
    } else {
      return res.html(200, noAccount);
    }
  });
}