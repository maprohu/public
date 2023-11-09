import { createContextId } from "@builder.io/qwik";

type GoogleMapsStore = {
    googleMaps?: any;
}

export const GoogleMapsContext = createContextId<GoogleMapsStore>('mhu.google-maps');


// export const GoogleMapsProvider = component$(() => {

// });