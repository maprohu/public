import type { JSXNode} from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const apiUrl = import.meta.env.PUBLIC_API_URL as string;
  const started = useSignal(false);

  function content(): JSXNode {
    if (started.value) {
      return <>
        Deploy Started
        <br/>
        <button onClick$={() => {
          started.value = false;
        }}>Back</button>
      </>
    } else {
      return <>
        <button onClick$={() => {
          fetch(apiUrl);
          started.value = true;
        }}>Start Deploy</button>
      </>
    }
  }

  return (
    <>
      {content()}
    </>
  );
});

export const head: DocumentHead = {
  title: "Deploy Trigger",
  meta: [
    {
      name: "description",
      content: "Deploy Trigger UI",
    },
  ],
}; 
