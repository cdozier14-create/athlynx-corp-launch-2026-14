import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import serverless from "serverless-http";

// Import the Express app from the built server
let app: any;
let handler: Handler;

// Lazy load the handler on first request
async function getHandler(): Promise<Handler> {
  if (!handler) {
    // Dynamically import the built server
    const module = await import("../../dist/index.js");
    const expressApp = module.handler || module.default;
    
    if (!expressApp) {
      throw new Error("Could not find Express app handler in dist/index.js");
    }
    
    // Wrap with serverless-http
    handler = serverless(expressApp) as any;
  }
  
  return handler;
}

export const netlifyHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const handler = await getHandler();
  return handler(event, context);
};

export { netlifyHandler as handler };
