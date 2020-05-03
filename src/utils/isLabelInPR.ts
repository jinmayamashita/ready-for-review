// T: Octokit.IssuesListLabelsOnIssueResponse
export const isLabelInPR = <T extends Array<{ name: string }>>(
  listLabels: T,
  labelName: string
): boolean => {
  return Boolean(
    listLabels.find(({ name }: { name: string }) => name === labelName)
  );
};
