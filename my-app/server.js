const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

// const port = process.env.PORT || 3081;
const port = 3081;
const dev = true; //process.env.NODE_ENV !== 'NODE_ENV';
const app = next({ dev });
const handle = app.getRequestHandler();

const apiPaths = {
  '/api': {
    target: 'http://localhost:3080',
    pathRewrite: {
      '^/api': '/api',
    },
    changeOrigin: true,
  },
};

const isDevelopment = true; //process.env.NODE_ENV !== 'production';

app
  .prepare()
  .then(() => {
    const server = express();

    if (isDevelopment) {
      server.use('/api', createProxyMiddleware(apiPaths['/api']));
    }

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('Error:::::', err);
  });
