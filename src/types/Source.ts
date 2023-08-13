export type SourceList = {
  count: number;
  data: Source[];
};

export type Source = {
  source_id: number;
  name: string;
  url: string;
  description: string;
};
