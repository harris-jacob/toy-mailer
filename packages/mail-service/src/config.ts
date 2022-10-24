import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  sendGridApiKey: asDefined(process.env.SEND_GRID_API_KEY),
  senderEmailAddress: asDefined(process.env.SENDER_EMAIL_ADDRESS),
};

function asDefined<T>(thing: T | undefined): T {
  if (thing === undefined) {
    throw new Error("thing was undefined");
  }

  return thing;
}
