type RemoveLabel = (
  _removeLabel: any,
  label: string,
  requestOptions: { owner: string; repo: string; issue_number: number }
) => Promise<any>;
export const removeLabel: RemoveLabel = async (
  _removeLabel,
  label,
  requestOptions
) => {
  _removeLabel({
    ...requestOptions,
    name: label,
  });
};
