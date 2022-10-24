import type * as activities from "./activities";
import dayjs from "dayjs";
import { proxyActivities, sleep } from "@temporalio/workflow";

const { sendTrialExpiredMail, sendWelcomeMail } = proxyActivities<
  typeof activities
>({
  retry: {
    initialInterval: "50 milliseconds",
    maximumAttempts: 2,
  },
  startToCloseTimeout: "30 seconds",
});

interface SignupWorkflowArgs {
  /** customer name */
  name: string;
  /** customer email address */
  emailAddress: string;
}

export async function signup({ name, emailAddress }: SignupWorkflowArgs) {
  // execute business logic workflows here e.g. createCustomer

  // send welcome mail
  await sendWelcomeMail({
    to: emailAddress,
    templateVars: {
      name,
    },
  });

  await sleep("5 minutes");

  await sendTrialExpiredMail({
    to: emailAddress,
    templateVars: {
      name,
      date: dayjs().add(1, "day").format("DD/MM/YYYY"),
    },
  });
}
