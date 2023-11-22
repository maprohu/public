import { Octokit, App } from "octokit";

export interface RepositoryDispatch {
    appId: string,
    privateKey: string,
    installationId: number,
    owner: string,
    repo: string,
    eventType: string,
}
export async function repositoryDispatch(params: RepositoryDispatch) {
    const app = new App({
        appId: params.appId,
        privateKey: params.privateKey,
    });
    const octokit = await app.getInstallationOctokit(
        params.installationId,
    );
    await octokit.rest.repos.createDispatchEvent({
        owner: params.owner,
        repo: params.repo,
        event_type: params.eventType,
    });
}
