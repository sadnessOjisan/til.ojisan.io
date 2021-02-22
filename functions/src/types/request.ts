export type SaveRequest = {
  title: string;
  content: string; // markdown
  tags: string[];
};

// TODO: どれか一つは必ずあるっていうのはどう型定義するだっけ？
export type EditRequest = {
  id: string;
  title?: string;
  content?: string; // markdown
  tags?: string[];
};
