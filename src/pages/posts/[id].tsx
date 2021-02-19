import { GetStaticPropsResult } from "next";
import { useEffect, useState } from "react";
import { toPostFromResponse } from "../../../types/model";
import {
  isValidPostResponse,
  isValidPostsResponse,
  PostResponse,
  PostsResponse,
} from "../../../types/response";

export default (postsResponse: { data: PostResponse }) => {
  const { data } = postsResponse;
  return <div>{data.id}</div>;
};

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<{ data: PostResponse }>> {
  const id = context.id;
  const response = await fetch(
    `https://asia-northeast1-til-ojisan-io-dev-ac456.cloudfunctions.net/getPostById?id=${id}`
  ); // change env
  const data = await response.json();
  if (!isValidPostResponse(data)) {
    throw new Error("invalid data type");
  }

  return {
    props: { data },
  };
}
