# Ready for review

This action swapping to Ready for review / In progress labels in pull request.

## Inputs

### `in-progress-label`

**Required** The name of the In progress label. Default `"In progress"`.

### `ready-for-review-label`

**Required** The name of the Ready for review label. Default `"Ready for review"`.

### `repo-token`

**Required** GITHUB_TOKEN as the value for the `repo-token` input parameter.

## Example usage

```
steps:
- uses: actions/ready-for-review@v1
  with:
    in-progress-label: 'foo'
    ready-for-review-label: 'bar'
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```