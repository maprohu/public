import { RepositoryDispatch } from './main';

interface EnvVars {
    GITHUB_PERSONAL_ACCESS_TOKEN: string | undefined;
    GITHUB_APP_ID: string | undefined;
    GITHUB_APP_PRIVATE_KEY: string | undefined;
    GITHUB_APP_INSTALLATION_ID: string | undefined;
    GITHUB_OWNER: string | undefined;
    GITHUB_REPO: string | undefined;
    GITHUB_EVENT_TYPE: string | undefined;
}

function envVar(key: keyof EnvVars): string {
    const env = process.env as unknown as EnvVars;
    const value = env[key];
    if (value === undefined) {
        throw `Missing env var: ${key}`;
    }
    return value;
}

export default () : RepositoryDispatch => {
    return {
        appId: envVar("GITHUB_APP_ID"),
        privateKey: envVar("GITHUB_APP_PRIVATE_KEY"),
        installationId: +envVar("GITHUB_APP_INSTALLATION_ID"),
        owner: envVar("GITHUB_OWNER"),
        repo: envVar("GITHUB_REPO"),
        eventType: envVar("GITHUB_EVENT_TYPE"),
    };
}