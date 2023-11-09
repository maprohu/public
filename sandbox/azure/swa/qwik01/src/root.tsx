import { component$, useVisibleTask$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  // https://github.com/BuilderIO/qwik/issues/3710#issuecomment-1662512593
  useVisibleTask$(() => {
    console.log(
      "%c🔍 Qwik Click-To-Source",
      "background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;",
      "Fix for Windows"
    );
    (globalThis as any).qwikOpenInEditor = function (path: string) {
      const resolvedURL = new URL(path, "http://local.local");
      const params = new URLSearchParams();
      const srcDir = (globalThis as any).qwikdevtools.srcDir;
      params.set("file", srcDir + resolvedURL.pathname);
      fetch("/__open-in-editor?" + params.toString());
    };
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
