import { GetStaticPropsResult } from "next";
import { toPostFromResponse } from "../../../types/model";
import {
  isValidPostIdsResponse,
  isValidPostResponse,
  PostResponse,
} from "../../../types/response";

export default (postsResponse: { data: PostResponse }) => {
  const { data } = postsResponse;
  const post = toPostFromResponse(data);
  const { title, tags, content, timeStamp } = post;
  const YYYYMMDD = `${timeStamp.getFullYear()}/${
    timeStamp.getMonth() + 1
  }/${timeStamp.getDate()}`;
  return (
    <div>
      <h1>{title}</h1>
      <div>{YYYYMMDD}</div>
      <div>
        {tags.map((tag) => (
          <span>{tag}</span>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch(
    `https://asia-northeast1-til-ojisan-io-dev-ac456.cloudfunctions.net/getAllPpostIds`
  );
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
