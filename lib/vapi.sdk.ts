import Vapi from "@vapi-ai/web";

const VAPI_TOKEN = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!VAPI_TOKEN) {
  console.error("VAPI Web Token is not configured. Please set NEXT_PUBLIC_VAPI_WEB_TOKEN in your environment variables.");
}

export const vapi = new Vapi(VAPI_TOKEN || "");