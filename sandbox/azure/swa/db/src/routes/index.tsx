import { JSXNode, component$, useResource$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";

interface AuthMe {
  clientPrincipal: ClientPrincipal | null
}

interface ClientPrincipal {
  identityProvider: string
  userId: string
  userDetails: string
  userRoles: string[]
  claims: object[]
}

interface AuthState {
  authMe: AuthMe | null
}

async function fetchAuthMe(): Promise<AuthMe> {
  const response = await fetch('/.auth/me');
  return await response.json() as AuthMe;
}

export default component$(() => {
  const nav = useNavigate();
  const authMeStore = useStore<AuthState>({ authMe: null }, { deep: false });

  // async function updateAuthMe() {
  //   authMe.authMe = await fetchAuthMe();
  // }

  useVisibleTask$(async () => {
    authMeStore.authMe = await fetchAuthMe();
  });

  function loginUi(): JSXNode {
    const authMe = authMeStore.authMe;

    console.log(authMe);

    if (authMe == null) {
      return <div>loading...</div>;
    } else {
      if (authMe.clientPrincipal == null) {
        return <>
          <div>not logged in</div>
          <p><button onClick$={() => {
            nav("/.auth/login/aad")
          }}>Login</button></p>
        </>
      }
      return <>
        <div>logged in</div>
        <p><button onClick$={() => {
          nav("/.auth/logout")
        }}>Logout</button></p>
      </>
    }
  }

  return (
    <>
      <h1>Hi 👋</h1>
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </p>
      {loginUi()}
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
