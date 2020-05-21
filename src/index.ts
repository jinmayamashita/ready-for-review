/* eslint-disable @typescript-eslint/camelcase */
import * as core from "@actions/core";
import * as github from "@actions/github";
import { isLabelInPR } from "./utils/isLabelInPR";
import { addLabels } from "./utils/addLabels";
import { removeLabel } from "./utils/removeLabel";

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

    const {
      data: { draft },
    } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: issueNumber,
    });

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
        addLabels(octokit.issues.addLabels, inProgressLabel, {
          owner,
          repo,
          issue_number: issueNumber,
        }) &&
          removeLabel(octokit.issues.removeLabel, readyForReviewLabel, {
            owner,
            repo,
            issue_number: issueNumber,
          })
      : // to ready for review
        addLabels(octokit.issues.addLabels, readyForReviewLabel, {
          owner,
          repo,
          issue_number: issueNumber,
        }) &&
          removeLabel(octokit.issues.removeLabel, inProgressLabel, {
            owner,
            repo,
            issue_number: issueNumber,
          });
  } catch (error) {
    core.debug(`message: ${error}`);
  }
};

main();
