import { getTagSnapshotByName } from "../../repository/tag/get-tag-by-name";
import { savePostAndTags } from "../../repository/post/save-post";
import { saveTag } from "../../repository/tag/save-tag";

type Post = {
  title: string;
  content: string;
};

export const savePost = async (post: Post, tagNames: string[]) => {
  const tagRefs = tagNames.map(async (name) => {
    const ref = await getTagSnapshotByName(name);
    if (ref === undefined) {
      const newRef = saveTag(name);
      return newRef;
    }
    return ref;
  });
  const refs = await Promise.all(tagRefs);
  await savePostAndTags({ ...post, timeStamp: new Date() }, refs);
};
