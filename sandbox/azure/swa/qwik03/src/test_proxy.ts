import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(
  '/.auth',
  createProxyMiddleware({
    target: 'http://localhost:4280/.auth',
    changeOrigin: true,
  }),
);

app.listen(3000);