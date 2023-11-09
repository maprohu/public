import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use(
    '/.auth',
    createProxyMiddleware({
        target: 'http://127.0.0.1:4280',
        changeOrigin: true,
    }),
);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
