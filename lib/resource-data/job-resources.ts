import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const jobLinks: Tool[] = [
  {
    title: "Wellfound",
    category: CATEGORIES.jobs,
    description:
      "Apply privately to 130,000+ remote jobs and startup jobs near you with one application. See salary and equity upfront. Find the latest tech jobs, company overviews, benefits and more at Wellfound.",
    subtitle: "Startup Job Search",
    url: "https://wellfound.com/",
  },
  {
    title: "We Work Remotely",
    category: CATEGORIES.jobs,
    description:
      "Advanced job search for We Work Remotely, allowing you to search and refine jobs across programming, marketing, customer service, etc. Find your next remote career.",
    subtitle: "Advanced Remote Job Search",
    url: "https://weworkremotely.com/",
  },
  {
    title: "Remote OK",
    category: CATEGORIES.jobs,
    description:
      "Looking for a remote job? Remote OK® is the #1 Remote Job Platform and has 1,133,730+ remote jobs as a Developer, Designer, Copywriter, Customer Support Rep, Sales Professional, Project Manager and more! Find a career where you can work remotely from anywhere.",
    subtitle: "Remote Jobs in Programming, Design, Sales and more #OpenSalaries",
    url: "https://remoteok.com/",
  },
  {
    title: "Training Superintelligence",
    category: CATEGORIES.jobs,
    description:
      "Turing develops large-scale RL environments and data generation systems that train multimodal agents to improve model performance in coding, real-world, economically valuable tasks, and advanced STEM reasoning.",
    url: "https://www.turing.com/",
  },
  {
    title: "remote-jobs",
    author: "remoteintech",
    category: CATEGORIES.jobs,
    description:
      "Source for remoteintech.company — a community-maintained directory of remote-friendly tech companies.",
    favicon: "/github.svg",
    url: "https://github.com/remoteintech/remote-jobs",
  },
];
