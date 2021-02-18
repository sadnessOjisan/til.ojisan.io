type PostFireStoreFieldType = {
  content: string; // markdown
  timeStamp: string;
  tagId: string; // ref
};

type TagFireStoreFieldType = {
  name: string;
};
