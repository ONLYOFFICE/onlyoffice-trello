import { Trello } from "Types/trello";
import { ActionProps } from "Types/power-up";

export function getCardButton(
  _t: Trello.PowerUp.IFrame,
  props: ActionProps
): Trello.PowerUp.CardButton[] {
  return [
    {
      icon: props.baseUrl,
      text: "ONLYOFFICE",
      condition: 'signedIn',
      callback: (t: Trello.PowerUp.IFrame) =>
        t.modal({
          title: "ONLYOFFICE",
          url: `/card-button`,
          fullscreen: true,
        }),
    },
  ];
}
