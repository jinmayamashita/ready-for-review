/* eslint-disable @typescript-eslint/camelcase */
import * as core from "@actions/core";
import * as github from "@actions/github";
import { isLabelInPR } from "./utils/isLabelInPR";

type Payload = {
  owner: string;
  repo: string;
  issueNumber: number;
};

const prepareOctokit = async ({ owner, repo, issueNumber }: Payload) => (
  // TODO: any type for now. fix later
  label: { labels: [string] } | { name: string },
  fn: any
): Promise<void> =>
  fn({
    owner,
    repo,
    issue_number: issueNumber,
    ...label,
  });

type AddLabel = (
  octokit: github.GitHub,
  label: string,
  requestOptions: { owner: string; repo: string; issue_number: number }
) => void;
const addLabel: AddLabel = (octokit, label, requestOptions) => {
  octokit.issues.removeLabel({
    ...requestOptions,
    name: label,
  });
};

type RemoveLabel = (
  octokit: github.GitHub,
  label: string,
  requestOptions: { owner: string; repo: string; issue_number: number }
) => void;
const removeLabel: RemoveLabel = (octokit, label, requestOptions) => {
  octokit.issues.removeLabel({
    ...requestOptions,
    name: label,
  });
};

const get = (name: string): string => core.getInput(name, { required: true });

const main = async (): Promise<void> => {
  try {
    const token = get("repo-token");
    const octokit = new github.GitHub(token);
    const context = github.context;

    const inProgressLabel = get("in-progress-label");
    const readyForReviewLabel = get("ready-for-review-label");
    const issueNumber = context.issue.number;

    const { owner, repo } = context.repo;

    const labelFuncs = await prepareOctokit({
      owner,
      repo,
      issueNumber,
    });

    const {
      data: { draft },
    } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: issueNumber,
    });

    const add = (label: string, fn = octokit.issues.addLabels): Promise<void> =>
      labelFuncs({ labels: [label] }, fn);

    const remove = (
      label: string,
      fn = octokit.issues.removeLabel
    ): Promise<void> => labelFuncs({ name: label }, fn);

    // check the labels in pr event on event
    const { data: labels } = await octokit.issues.listLabelsOnIssue({
      ...context.repo,
      issue_number: issueNumber,
    });

    const isInProgress = isLabelInPR(labels, inProgressLabel);
    const isReadyForReview = isLabelInPR(labels, readyForReviewLabel);

    if (!draft && !isInProgress && !isReadyForReview) {
      return;
    }

    return draft
      ? // to draft
        add(inProgressLabel) && remove(readyForReviewLabel)
      : // to ready for review
        add(readyForReviewLabel) && remove(inProgressLabel);
  } catch (error) {
    core.debug(`message: ${error}`);
  }
};

main();
