import { GetStaticPropsResult } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toPostFromResponse } from "../../../types/model";
import { isValidPostsResponse, PostsResponse } from "../../../types/response";

export default (postsResponse: { data: PostsResponse }) => {
  const posts = postsResponse.data.map((res) => toPostFromResponse(res));
  return posts.map((post) => (
    <Link href={`posts/${post.id}`}>
      <a>
        <div>
          <h2>{post.title}</h2>
          <div>
            {post.tags.map((tag) => (
              <span>{tag}</span>
            ))}
          </div>
        </div>
      </a>
    </Link>
  ));
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ data: PostsResponse }>
> {
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
