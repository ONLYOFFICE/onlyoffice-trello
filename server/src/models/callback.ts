type Action = {
  type: number;
  userid: string;
};

export type Callback = {
  key: string;
  status: number;
  users: string[];
  actions: Action[];
  url?: string;
};
