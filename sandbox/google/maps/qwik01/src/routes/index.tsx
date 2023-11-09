import { component$, useSignal } from "@builder.io/qwik";
import { useGoogleMap$ } from "qwik-google-maps-loader";
import { googleMapsOptions } from "~/root";

export default component$(() => {
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
  return (
    <>
      <div ref={elem} style={{
        height: "100vh"
      }}></div>
    </>
  );
});

