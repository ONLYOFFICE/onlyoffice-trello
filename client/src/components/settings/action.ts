import { Trello } from "Types/trello";

export function getSettings(t: Trello.PowerUp.IFrame, options: any): any {
  if (options.context.permissions?.organization === "write") {
    return t.popup({
      title: "Note Settings",
      url: "./show-settings.html",
      height: 150,
    });
  }
  return null;
}
