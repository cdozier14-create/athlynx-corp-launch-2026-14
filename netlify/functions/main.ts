import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import serverless from "serverless-http";

// Lazy-loaded handler to avoid duplicate app instances
let cachedHandler: Handler | null = null;

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Initialize handler on first request
  if (!cachedHandler) {
    try {
      // Dynamically import the built server
      const module = await import("../../dist/index.js");
      const expressApp = module.handler || module.default;
      
      if (!expressApp) {
        console.error("Could not find Express app handler in dist/index.js");
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Server initialization failed" }),
        };
      }
      
      // Wrap with serverless-http adapter
      cachedHandler = serverless(expressApp) as any;
    } catch (error) {
      console.error("Failed to load server handler:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server initialization failed" }),
      };
    }
  }
  
  // Delegate to the serverless handler
  return cachedHandler(event, context);
};
