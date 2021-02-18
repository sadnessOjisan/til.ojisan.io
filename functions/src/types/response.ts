type Post = {
  id: string;
  content: string; // html
  tags: Tag[];
};

type Tag = {
  id: string;
  name: string;
};
