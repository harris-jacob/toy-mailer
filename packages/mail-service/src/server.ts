// @@@SNIPSTART typescript-hello-client
import { WorkflowClient } from "@temporalio/client";
import express from "express";
import { signup } from "./workflows";

async function run() {
  const app = express();
  const port = 5000;
  app.use(express.json());

  // establish connection to the temporal server
  const client = new WorkflowClient();

  app.post<{}, {}, { name: string; email: string }>(
    "/signup",
    async (req, res) => {
      const { name, email } = req.body;

      const handle = await client.start(signup, {
        args: [{ name, emailAddress: email }],
        workflowId: genCustomerId(),
        taskQueue: "signup",
      });

      console.log(`Started workflow ${handle.workflowId}`);

      res.send();
    }
  );

  app.listen(port, () => {
    console.log(`Email app listening on ${port}`);
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

let customerId = 0;
function genCustomerId(): string {
  return `customer-${customerId++}`;
}
