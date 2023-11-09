import { component$ } from "@builder.io/qwik";
import { routeAction$ } from "@builder.io/qwik-city";


export const useLoginHeader = routeAction$(async (data, requestEvent) => {
    const header = requestEvent.request.headers.get('x-ms-client-principal');
    console.log(header);
    return 26;
});

export default component$(() => {
    const headers = useLoginHeader();
    console.log(headers);
    return (
        <div>
            <a href="/.auth/login/github">GitHub Login</a>
            hi
            <button onClick$={async () => {
                const {value} = await headers.submit({});
                console.log(value);
            }}>Refresh</button>
        </div>
    );
});
