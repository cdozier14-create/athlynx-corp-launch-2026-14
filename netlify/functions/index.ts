import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Import the Express app
import handler from "../../dist/index.js";

export const netlifyHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Convert Netlify event to Express-compatible request
  return await handler(event, context);
};

export { netlifyHandler as handler };
