import { Trello } from 'Types/trello';

type SettingsOptions = {
  context: {
    permissions: {
      organization: string;
    };
  };
};

export function getSettings(
  t: Trello.PowerUp.IFrame,
  options: SettingsOptions
): any {
  if (options.context.permissions?.organization === 'write') {
    return t.popup({
      title: 'Note Settings',
      url: './show-settings',
      height: 150,
    });
  }
  return null;
}
