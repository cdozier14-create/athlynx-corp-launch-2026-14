// Import the serverless handler from the built Express app
import * as app from "../../dist/index.js";

function resolveHandler() {
  const candidate: any = (app as any).handler;
  if (typeof candidate !== "function") {
    throw new Error(
      'Expected "../../dist/index.js" to export a function named "handler".'
    );
  }
  return candidate;
}

export const handler = resolveHandler();
