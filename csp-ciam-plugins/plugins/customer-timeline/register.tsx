import { register } from "csp-plugin";
import {
  CustomerTimelinePage,
  CustomerTimelineWidget,
} from "./CustomerTimelinePage";

const manifest = register({
  name: "customer-timeline",
  routes: {
    "customer-timeline": CustomerTimelinePage,
  },
  slots: {
    sidebar: [CustomerTimelineWidget],
    header: [],
  },
});

export default manifest;
