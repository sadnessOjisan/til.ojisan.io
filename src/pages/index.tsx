import { GetStaticPropsResult } from "next";
import { toPostFromResponse } from "../../types/model";
import { isValidPostsResponse, PostsResponse } from "../../types/response";
import { getHost } from "../util/getHost";

export default (postsResponse: { data: PostsResponse }) => {
  const posts = postsResponse.data.map((res) => toPostFromResponse(res));
  return <div>{posts.map((post) => post.id)}</div>;
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ data: PostsResponse }>
> {
  const response = await fetch(`${getHost()}/getAllPosts`);
  const data = await response.json();
  if (!isValidPostsResponse(data)) {
    throw new Error("invalid data type");
  }

  return {
    props: { data },
  };
}
