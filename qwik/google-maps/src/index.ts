import { NoSerialize, QRL, createContextId, implicit$FirstArg, noSerialize, useContext, useContextProvider, useVisibleTask$ } from "@builder.io/qwik";
import { Loader, LoaderOptions } from "google-maps";


export type GoogleMapsApi = typeof google.maps;
export type GoogleMapsCallback = (api: GoogleMapsApi) => void;

export interface GoogleMapsLoaderProps {
  apiKey?: string;
  loaderOptions?: LoaderOptions,
}
export interface GoogleMapsStore {
  controller?: NoSerialize<GoogleMapsController>;
}

export interface GoogleMapsController {
  load: () => void;
  register: (callback: GoogleMapsCallback) => void;
}

const googleMapsContextId = createContextId<GoogleMapsStore>("mhu.google-maps");

function initializeStore(store: GoogleMapsStore, props?: GoogleMapsLoaderProps): GoogleMapsController {
  if (!store.controller) {
    let api: GoogleMapsApi | undefined = undefined;
    const callbacks = Array<GoogleMapsCallback>();

    let loadStarted = false;

    const startLoading = async () => {
      if (loadStarted) {
        return;
      }
      loadStarted = true;

      const loader = new Loader(props?.apiKey, props?.loaderOptions);
      const google = await loader.load();
      api = google.maps;
      const callbacksCopy = callbacks.slice();
      callbacks.length = 0;
      for (const callback of callbacksCopy) {
        callback(api);
      }
    }

    store.controller = noSerialize({
      load: startLoading,
      register: (callback) => {
        if (!api) {
          callbacks.push(callback);
          startLoading();
        } else {
          callback(api);
        }
      },
    });
  }
  return store.controller!;
}

export function useGoogleMapsProvider(props: GoogleMapsLoaderProps, load = false) {
  const store: GoogleMapsStore = {};
  useContextProvider(googleMapsContextId, store);
  useVisibleTask$(() => {
    const controller = initializeStore(store, props);
    if (load) {
      controller.load();
    }
  });
}

export function useGoogleMapQrl<T>(
  callback: QRL<(api: GoogleMapsApi, data: T) => void>,
  props: GoogleMapsLoaderProps,
  data: T,
) {
  const store = useContext(googleMapsContextId);
  useVisibleTask$(async () => {
    const fn = await callback.resolve();
    const controller = initializeStore(store, props);
    controller.register((api) => fn(api, data));
  });
}

export const useGoogleMap$ = implicit$FirstArg(useGoogleMapQrl);