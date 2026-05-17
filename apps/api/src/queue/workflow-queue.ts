import { Queue } from "bullmq";
import type { WorkflowJobData } from "@gelocci/studio-workflow";
import { env } from "../env.js";

export const workflowQueue = new Queue<WorkflowJobData>(env.WORKFLOW_QUEUE_NAME, {
  connection: {
    url: env.REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1500,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

export async function enqueueWorkflowRun(data: WorkflowJobData): Promise<void> {
  await workflowQueue.add("run-workflow", data, {
    jobId: `workflow:${data.workflowRunId}`,
  });
}
