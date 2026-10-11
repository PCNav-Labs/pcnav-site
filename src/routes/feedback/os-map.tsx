import { createFileRoute } from "@tanstack/react-router";
import { AppFeedbackPage, OS_MAP_FEEDBACK } from "@/components/app-feedback";

export const Route = createFileRoute("/feedback/os-map")({
  head: () => ({
    meta: [
      { title: "OS Map Feedback | PCNav" },
      {
        name: "description",
        content: "Report bugs and suggest features to help improve OS Map.",
      },
      { property: "og:title", content: "OS Map Feedback — PCNav" },
      { property: "og:description", content: "Observations help improve OS Map." },
    ],
  }),
  component: () => <AppFeedbackPage app={OS_MAP_FEEDBACK} />,
});
