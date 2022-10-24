import { MailService } from "@sendgrid/mail";
import { renderFileAsync, configure } from "eta";
import { config } from "./config";
import path from "path";

/** minimum required args for any mail activity */
interface MailActivityArgs<T extends object> {
  /** recipient of the mail */
  to: string;
  /** template variables */
  templateVars: T;
}

interface WelcomeMailVariables {
  name: string;
}

interface TrialExpiredMailVariables {
  name: string;
  date: string;
}

type MailType = "welcome" | "trial-expired";

// globals
const service = new MailService();
service.setApiKey(config.sendGridApiKey);
configure({ views: path.join(process.cwd(), "../templates/build") });

export async function sendWelcomeMail(
  args: MailActivityArgs<WelcomeMailVariables>
) {
  const mail = await loadMail("welcome", args.templateVars);
  return service.send({
    to: args.to,
    from: config.senderEmailAddress,
    subject: "Welcome to your trial of example.com",
    html: mail,
  });
}

export async function sendTrialExpiredMail(
  args: MailActivityArgs<TrialExpiredMailVariables>
) {
  const mail = await loadMail("trial-expired", args.templateVars);
  return service.send({
    to: args.to,
    from: config.senderEmailAddress,
    subject: "Your trial of example.com is expiring",
    html: mail,
  });
}

async function loadMail(name: MailType, data: object) {
  return (await renderFileAsync(`${name}.html`, data)) as string;
}
