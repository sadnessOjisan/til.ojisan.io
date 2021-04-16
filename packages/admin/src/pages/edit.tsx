import {
  Button,
  Flex,
  Form,
  ProgressCircle,
  Text,
  TextArea,
  TextField,
  View,
} from "@adobe/react-spectrum";
import Send from "@spectrum-icons/workflow/Send";
import { ENDPOINT } from "endpoint/src";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useAuthTokenContext } from "../context/auth";
import { Post } from "../types/Post";
import { getHost } from "../util/getHost";

type PostState =
  | undefined
  | {
      isSending: true;
      error: undefined;
    }
  | {
      isSending: false;
      error: undefined;
    }
  | {
      isSending: false;
      error: any;
    };

type DataState =
  | undefined
  | { isLoading: true; data: undefined; error: undefined }
  | { isLoading: false; data: Post; error: undefined }
  | { isLoading: false; data: undefined; error: string };

// routing からもらう id
export const Edit = (props: { id: string }) => {
  const session = useAuthTokenContext();
  const [getState, setData] = useState<DataState>(undefined);
  const [postState, setState] = useState<PostState>(undefined);
  const [title, setTitle] = useState("");
  const [til, setTil] = useState("");
  const [tags, setTags] = useState(""); // comma separate TODO: array

  const resetForm = () => {
    setTitle("");
    setTil("");
    setTags("");
  };

  useEffect(() => {
    if (props.id === undefined) {
      alert("id入れて");
    }
  }, [props.id]);

  useEffect(() => {
    setData({ isLoading: true, data: undefined, error: undefined });
    fetch(`${getHost()}/${ENDPOINT.getPostByIdForEdit}?id=${props.id}`)
      .then((res) => {
        res.json().then((data) => {
          // TODO: validation
          setData({ isLoading: false, data: data, error: undefined });
          setTitle(data.title);
          setTil(data.content);
          setTags(data.tags.join(","));
        });
      })
      .catch((e) => {
        setData({ isLoading: false, data: undefined, error: e.message });
      });
  }, []);

  const validate = () => {
    return !(title === "" && til === "" && tags === "");
  };
  const handleSubmit = async (e: any) => {
    if (!validate()) {
      alert("どれか一つ入力すべき");
      return;
    }
    e.preventDefault();
    const tagsArray = tags.split(",");
    setState({ isSending: true, error: undefined });
    if (session === undefined) return;
    const token = await session.getIdToken();
    fetch(`${getHost()}/editPost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: props.id,
        title,
        content: til,
        tags: tagsArray,
      }),
    })
      .then(() => {
        setState({ isSending: false, error: undefined });
        resetForm();
      })
      .catch((e) => {
        console.error(e);
        setState({ isSending: false, error: e.message });
      });
  };
  return (
    <View padding="size-250">
      {getState === undefined || getState.isLoading ? (
        <Flex justifyContent="center">
          {(<ProgressCircle aria-label="Loading…" isIndeterminate />) as any}
        </Flex>
      ) : (
        <Form onSubmit={handleSubmit} isRequired>
          {
            (
              <TextField label="title" onChange={setTitle} value={title} />
            ) as any
          }
          <TextField label="tags" onChange={setTags} value={tags} />
          <TextArea
            label="content"
            onChange={setTil}
            height="60vh"
            value={til}
          />
          <Button
            type="submit"
            variant="cta"
            marginTop={24}
            isDisabled={postState !== undefined && postState.isSending}
            width="200px"
            height="40px"
            marginX="auto"
          >
            <Send />
            <Text width={"auto"}>
              {postState !== undefined && postState.isSending
                ? "sending"
                : "submit"}
            </Text>
          </Button>
        </Form>
      )}
      {postState && postState.error && (
        <div>送信error {JSON.stringify(postState.error)}</div>
      )}
    </View>
  );
};
