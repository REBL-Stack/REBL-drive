// 'React-scripts start' sets up a development server that automatically
// registers files with this name. This proxy file sets up a CORS header
// for manifest.json, allowing sign in via Blockstack without using
// the webpack configuration file that create-react-app has configured
// and hidden.
// https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.get('/manifest.json', (req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET'
    });
    next();
  })
  app.get('/*', (req, res, next) => {
    console.log("Custom HTTP headers for:", req.url)
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET',
      "can't-be-evil": true,
      "Content-Security-Policy": "default-src 'self'"
    });
    next();
  })
  app.use(
    '/proxy',
    proxy({
      target: "https://gaia.blockstack.org", // ignored
      ignorePath: true,
      //pathRewrite: {'^/proxy/' : '', '\/\/':'/%2F'},
      router: function (req) {
        const path = req.url.replace(/^\/proxy\//, '').replace('//', '/%2F')
        const url = 'https://' + path
        console.log("PROXY:", req.url, "->", url);
        // return "https://gaia.blockstack.org/hub/1KbveCzipEoYGFh3hUMX3cRDYogwNeFDzD/%2Favatar-0"
        return (url)
      },
      changeOrigin: true,
      followRedirects: true
    })
  );
};
