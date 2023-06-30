/**
 * addLabels: {(
 * params?: Octokit.RequestOptions &
 * Octokit.IssuesAddLabelsParamsDeprecatedNumber
 * ): Promise<Octokit.Response<Octokit.IssuesAddLabelsResponse>>;
 * (
 *  params?: Octokit.RequestOptions & Octokit.IssuesAddLabelsParams
 * ): Promise<Octokit.Response<Octokit.IssuesAddLabelsResponse>>;
 *  endpoint: Octokit.Endpoint;
 * };
 */
type AddLabels = (
  _addLabels: any,
  label: string,
  requestOptions: { owner: string; repo: string; issue_number: number }
) => Promise<any>;
export const addLabels: AddLabels = async (_addLabels, label, requestOptions) =>
  _addLabels({
    ...requestOptions,
    labels: [label],
  });
