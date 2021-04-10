import { isValidTagFireStoreFieldType } from "../../types/firestore/tag";
import { Tag } from "../../domain/Tag";

export const getTagByRef = async (
  tagRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
): Promise<Tag> => {
  const tagDoc = await tagRef.get();
  const tagData = tagDoc.data();
  if (!isValidTagFireStoreFieldType(tagData)) {
    console.error(`${JSON.stringify(tagData)} is invalid data.`);
    throw new Error("invalid tagData");
  }
  const tag = {
    id: tagDoc.id,
    name: tagData.name,
    timeStamp: tagData.timeStamp.toDate(),
  };
  return Tag.createTag(tag);
};

export const getTagsByRefs = async (
  tagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[]
): Promise<Tag[]> => {
  const postRefs = await tagRefs.map((tagRef) => getTagByRef(tagRef));
  const refs = await Promise.all(postRefs);
  return refs;
};
