import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { RenderContent, getBuilderSearchParams, getContent } from "@builder.io/sdk-qwik";
import { CUSTOM_COMPONENTS } from "~/components/builder-registry";

export const BUILDER_PUBLIC_API_KEY = "a9fdaa1b53804b37b2ced3f32168a9ca";
export const BUILDER_MODEL = "test-block";

export default component$(() => {
  const location = useLocation();

  const builderContentRsrc = useResource$<any>(() => {
    return getContent({
      model: BUILDER_MODEL,
      apiKey: BUILDER_PUBLIC_API_KEY,
      options: getBuilderSearchParams(location.params),
      userAttributes: {
        urlPath: location.url.pathname || "/",
      },
    });
  });

  return (

    <>
      <h1>Hi 👋</h1>
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </p>
      <p>And here comes the builder.io content:</p>
      <Resource
        value={builderContentRsrc}
        onPending={() => <div>Loading...</div>}
        onResolved={(content) => (
          <RenderContent
            apiVersion="v3"
            model={BUILDER_MODEL}
            content={content}
            apiKey={import.meta.env.PUBLIC_BUILDER_API_KEY}
            customComponents={CUSTOM_COMPONENTS}
          />
        )}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
