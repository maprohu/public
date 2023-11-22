* Personal Access Token:
  * Fine-grained tokens
  * Only Select Repositories
  * Repository Permissions:
    * Contents (repo?): Read and Write
    * Workflows: Read and Write
    * Metadata: (mandatory) Read-Only

* https://github.com/settings/personal-access-tokens/new

```bash
curl https://api.github.com/repos/maprohu/public/dispatches --request POST -d '{"event_type": "hello"}' -H "Authorization: Bearer <token>"
```

* ```.github/workflows/hook.yml```:

```yaml
on:
  workflow_dispatch:
  repository_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo hello!
```

* https://dev.to/rikurouvila/how-to-trigger-a-github-action-with-an-htt-request-545
