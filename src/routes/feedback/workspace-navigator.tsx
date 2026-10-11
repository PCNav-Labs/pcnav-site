import { createFileRoute } from "@tanstack/react-router";
import { AppFeedbackPage, WORKSPACE_NAVIGATOR_FEEDBACK } from "@/components/app-feedback";

export const Route = createFileRoute("/feedback/workspace-navigator")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator Feedback | PCNav" },
      {
        name: "description",
        content: "Report bugs and suggest features to help improve Workspace Navigator.",
      },
      { property: "og:title", content: "Workspace Navigator Feedback — PCNav" },
      { property: "og:description", content: "Observations help improve Workspace Navigator." },
    ],
  }),
  component: () => <AppFeedbackPage app={WORKSPACE_NAVIGATOR_FEEDBACK} />,
});
