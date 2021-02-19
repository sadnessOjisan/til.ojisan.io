import { GetStaticPropsResult } from "next";
import { useEffect, useState } from "react";
import { toPostFromResponse } from "../../../types/model";
import { isValidPostsResponse, PostsResponse } from "../../../types/response";

export default (postsResponse: { data: PostsResponse }) => {
  const posts = postsResponse.data.map((res) => toPostFromResponse(res));
  return <div>{posts.map((post) => post.id)}</div>;
};

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<{ data: PostsResponse }>> {
  const response = await fetch(
    "https://asia-northeast1-til-ojisan-io-dev-ac456.cloudfunctions.net/getAllPosts"
  ); // change env
  const data = await response.json();
  if (!isValidPostsResponse(data)) {
    throw new Error("invalid data type");
  }

  return {
    props: { data },
  };
}
