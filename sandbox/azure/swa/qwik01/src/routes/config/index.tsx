import { component$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";

export const useServerData = routeLoader$(async () => {
    return "server data";
});
export const useServerData2 = routeLoader$(async () => {
    return "server data 2";
});
export default component$(() => {
    const nav = useNavigate();
    const serverData = useServerData();
    const serverData2 = useServerData2();
    return (
        <div>
            hello: {serverData}
            hello2: {serverData2}
            <button onClick$={() => nav()}>Refresh</button>
        </div>
    );
});