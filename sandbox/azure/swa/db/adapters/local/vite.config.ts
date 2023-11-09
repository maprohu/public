import { type Plugin } from "vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";
import { createProxyMiddleware } from 'http-proxy-middleware';

function viteServerMiddlewares(): Plugin {
  const configureServer: Plugin['configureServer'] = async (server) => {
    server.middlewares.use(
      '/.auth',
      createProxyMiddleware({
        target: 'http://127.0.0.1:4280',
        changeOrigin: true,
        ws: true,
        xfwd: true,
      } as any) as any
    );
    server.middlewares.use(
      '/data-api',
      createProxyMiddleware({
        target: 'http://127.0.0.1:4280',
        changeOrigin: true,
        ws: true,
        xfwd: true,
      } as any) as any
    );
  };

  return {
    name: 'dev-server-middleware',
    enforce: 'pre',
    apply: 'serve',
    configureServer,
    configurePreviewServer: configureServer as any,
  };
}
export default extendConfig(baseConfig, () => {
  return {
    plugins: [viteServerMiddlewares()],
  };
});
