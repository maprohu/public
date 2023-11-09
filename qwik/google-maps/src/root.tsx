import { component$, useSignal } from "@builder.io/qwik";
import { GoogleMapsLoaderProps, useGoogleMap$, useGoogleMapsProvider } from ".";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Google Maps Dev App</title>
      </head>
      <body>
        <MapProviderTest />
      </body>
    </>
  );
};

export const googleMapsOptions: GoogleMapsLoaderProps = {
  apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
}

export const MapProviderTest = component$(() => {
  useGoogleMapsProvider(googleMapsOptions);
  return <>
    <MapTest />
    <MapTest />
  </>
});

export const MapTest = component$(() => {
  const elem = useSignal<HTMLElement>();
  useGoogleMap$(
    (api, elem) => {
      new api.Map(elem.value!, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }, 
    googleMapsOptions,
    elem,
  );

  return <div ref={elem} style={{ height: "300px" }} />
});