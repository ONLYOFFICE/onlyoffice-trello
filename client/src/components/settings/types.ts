export type SettingsData = {
  Address?: string,
  Jwt?: string,
  Header?: string,
};

export type SettingsOptions = {
  context: {
    permissions: {
      organization: string;
    };
  };
};
