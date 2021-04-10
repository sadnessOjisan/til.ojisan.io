import { GetStaticPropsResult } from "next";
import { PostResponse } from "type/src/api/response/post-response";
import { toPostFromResponse } from "../../../types/model";
import {
  isValidPostIdsResponse,
  isValidPostResponse,
} from "../../../types/response";
import { format } from "../../util/date";
import { getHost } from "../../util/getHost";

export default (postsResponse: { data: PostResponse }) => {
  const { data } = postsResponse;
  const post = toPostFromResponse(data);
  const { title, tags, content, timeStamp } = post;
  return (
    <div>
      <h1 className="text-3xl mb-2">{title}</h1>
      <div className="w-28 mb-2">{format(post.timeStamp)}</div>
      <div>
        {tags.map((tag) => (
          <span>{tag}</span>
        ))}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="mt-4"
        id="post-body"
      ></div>
    </div>
  );
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch(`${getHost()}/getAllPpostIds`);
  const ids = await res.json();

  if (!isValidPostIdsResponse(ids)) {
    throw new Error("invalid ids type");
  }
  // Get the paths we want to pre-render based on posts
  const paths = ids.map((id) => ({
    params: { id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<{ data: PostResponse }>> {
  const id = context.params.id;
  const response = await fetch(`${getHost()}/getPostById?id=${id}`);
  const data = await response.json();
  if (!isValidPostResponse(data)) {
    throw new Error("invalid data type");
  }
  return {
    props: { data },
  };
}
