import { ENDPOINT } from "endpoint/src";
import { GetStaticPropsResult } from "next";
import Link from "next/link";
import { PostsResponse } from "type/src/api/response/post-response";
import { toPostFromResponse } from "../../../types/model";
import { isValidPostsResponse } from "../../../types/response";
import { format } from "../../util/date";
import { getHost } from "../../util/getHost";

export default (postsResponse: { data: PostsResponse }) => {
  const posts = postsResponse.data.map((res) => toPostFromResponse(res));
  return (
    <div>
      <h1 className="text-center text-3xl">
        <span className="text-blue-700">T</span>oday oj
        <span className="text-blue-700">I</span>san
        <span className="text-blue-700">L</span>earned
      </h1>
      {posts.map((post) => (
        <Link href={`posts/${post.id}`}>
          <a>
            <div className="flex flex-row my-4 items-center border-white border-solid border-2 p-2 rounded-md hover:border-blue-700">
              <div className="w-28">{format(post.timeStamp)}</div>
              <div className="flex flex-col">
                <h2 className="mr-4">{post.title}</h2>
                <div>
                  {post.tags.map((tag) => (
                    <span className="mr-4">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ data: PostsResponse }>
> {
  const response = await fetch(`${getHost()}/${ENDPOINT.getAllShowablePosts}`);
  const data = await response.json();
  if (!isValidPostsResponse(data)) {
    throw new Error("invalid data type");
  }
  const filteredData = data.filter((d) => d.show === true);
  return {
    props: { data: filteredData },
  };
}
