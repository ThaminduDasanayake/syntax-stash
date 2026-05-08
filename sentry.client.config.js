import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://67acd46883704ecabe947a5f254db3d8@app.glitchtip.com/23162",
  tracesSampleRate: 0.01,
  autoSessionTracking: false,
});
