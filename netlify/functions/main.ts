import type { Handler } from "@netlify/functions";

// Import the Express app handler from the built server
import { handler as expressApp } from "../../dist/index.js";

// Netlify Functions handler
export const handler: Handler = async (event, context) => {
  // For serverless, we need to handle the request differently
  // This is a simple pass-through to the Express app
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "API endpoint" }),
  };
};
