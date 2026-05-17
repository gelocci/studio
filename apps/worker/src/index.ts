import { Worker } from "bullmq";
import type { WorkflowJobData } from "@gelocci/studio-workflow";
import { env } from "./env.js";
import { executeWorkflowJob } from "./engine/workflow-engine.js";

const worker = new Worker<WorkflowJobData>(
  env.WORKFLOW_QUEUE_NAME,
  async (job) => {
    console.log(`[worker] Executando workflow job ${job.id}`, job.data);
    await executeWorkflowJob(job.data);
    console.log(`[worker] Workflow job ${job.id} concluído`);
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
    concurrency: 2,
  },
);

worker.on("completed", (job) => {
  console.log(`[worker] Job concluído: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`[worker] Job falhou: ${job?.id}`, error);
});

console.log(`[worker] Studio Worker iniciado. Queue=${env.WORKFLOW_QUEUE_NAME} Redis=${env.REDIS_URL}`);
