const baseRoute = "/api";

module.exports = (app) => {
  app.use(`${baseRoute}/comments`, require("./comments.route"));
  app.use(`${baseRoute}/activitylogs`, require("./activities-log.route"));
  app.use(`${baseRoute}/events`, require("./events.route"));
  app.use(`${baseRoute}/ai-res`, require("./thread-prompts.route"));
  app.use(`${baseRoute}/prompts`, require("./prompts.route"));
  app.use(`${baseRoute}/threads`, require("./thread.route"));
  app.use(`${baseRoute}/common`, require("./common.routes"));
  app.use(`${baseRoute}/searches`, require("./searches.route"))
};