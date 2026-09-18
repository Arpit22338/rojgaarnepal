import { datadogRum } from "@datadog/browser-rum";
import { nextjsPlugin, onRouterTransitionStart } from "@datadog/browser-rum-nextjs";

export { onRouterTransitionStart };

const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;

if (applicationId && clientToken) {
  datadogRum.init({
    applicationId,
    clientToken,
    site: "us5.datadoghq.com",
    service: "jobs-nepal",
    env: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    plugins: [nextjsPlugin()],
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });
}
