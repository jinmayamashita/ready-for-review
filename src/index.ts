/* eslint-disable @typescript-eslint/camelcase */
import * as core from "@actions/core";
import * as github from "@actions/github";

type Payload = {
  owner: string;
  repo: string;
  issue_number: number;
  label: string;
};

const main = async (): Promise<void> => {
  const token = core.getInput("repo-token", { required: true });
  const inProgressLabel = core.getInput("in-progress-label", {
    required: true,
  });
  const readyForReviewLabel = core.getInput("ready-for-review-label", {
    required: true,
  });

  const octokit = new github.GitHub(token);
  const context = github.context;
  const issueNumber = context.issue.number;

  // TODO: remove dependency relationship (octokit)
  const addLabel = async ({
    owner,
    repo,
    issue_number,
    label,
  }: Payload): Promise<void> => {
    octokit.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: [label],
    });
  };

  const removeLabel = async ({
    owner,
    repo,
    issue_number,
    label,
  }: Payload): Promise<void> => {
    octokit.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name: label,
    });
  };

  // check active labels on this PR
  const { data } = await octokit.issues.listLabelsOnIssue({
    ...context.repo,
    issue_number: issueNumber,
  });

  const isInProgress = data.find(({ name }) => name === inProgressLabel);
  const isReadyForReview = data.find(
    ({ name }) => name === readyForReviewLabel
  );

  if (!isInProgress && !isReadyForReview) {
    return;
  }

  if (isInProgress) {
    const payload = { ...context.repo, issue_number: issueNumber };
    addLabel({ ...payload, label: readyForReviewLabel });
    removeLabel({ ...payload, label: inProgressLabel });
  }

  if (isReadyForReview) {
    const payload = { ...context.repo, issue_number: issueNumber };
    addLabel({ ...payload, label: inProgressLabel });
    removeLabel({ ...payload, label: readyForReviewLabel });
  }
};
main();
