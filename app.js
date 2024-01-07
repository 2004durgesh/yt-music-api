import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const app = express();
app.use((req, res, next) => {
    console.log(req.path); // Log the requested path
    next();
  });
app.use('/api/express', createProxyMiddleware({ target: 'http://127.0.0.1:3000', changeOrigin: true }));
app.use('/api/flask', createProxyMiddleware({ target: 'http://localhost:8888', changeOrigin: true }));
  
  

const PROXY_PORT = process.env.PROXY_PORT || 5000;
app.listen(PROXY_PORT, () => {
  console.log(`PROXY_PORT is running on port http://127.0.0.1:${PROXY_PORT}`);
});
