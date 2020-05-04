# Ready for review

An action for automatically label swapping for draft pull requests.

[Draft pull requests](https://github.blog/2019-02-14-introducing-draft-pull-requests/) are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro.

## Usage

### Inputs

#### `in-progress-label`

**Required** The name of the In progress label. Default `"In progress"`.

#### `ready-for-review-label`

**Required** The name of the Ready for review label. Default `"Ready for review"`.

#### `repo-token`

**Required** GITHUB_TOKEN as the value for the `repo-token` input parameter.

### Example usage

```
on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  foo:
    runs-on: ubuntu-latest
    name: fooName
    steps:
    - name: label swapping
      uses: jinmayamashita/ready-for-review@draft-debug
      with:
        in-progress-label: 'my InProgress label'
        ready-for-review-label: 'my ReadyForReview label'
        repo-token: ${{ secrets.GITHUB_TOKEN }}
```