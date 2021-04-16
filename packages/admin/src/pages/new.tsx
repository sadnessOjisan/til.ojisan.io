import {
  Button,
  Form,
  Text,
  TextArea,
  TextField,
  View,
} from "@adobe/react-spectrum";
import Send from "@spectrum-icons/workflow/Send";
import { ENDPOINT } from "endpoint/src";
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAuthTokenContext } from "../context/auth";
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

export const New = () => {
  const session = useAuthTokenContext();
  const [postState, setState] = useState<PostState>(undefined);
  const [title, setTitle] = useState("");
  const [til, setTil] = useState("");
  const [tags, setTags] = useState(""); // comma separate TODO: array

  const resetForm = () => {
    setTitle("");
    setTil("");
    setTags("");
  };

  const validate = () => {
    return !(title === "" || til === "" || tags === "");
  };
  const handleSubmit = async (e: any) => {
    if (!validate()) {
      alert("全部入力すべき");
      return;
    }
    e.preventDefault();
    const tagsArray = tags.split(",");
    setState({ isSending: true, error: undefined });
    if (session === undefined) throw new Error("should login");
    const token = await session.getIdToken();
    fetch(`${getHost()}/${ENDPOINT.saveTil}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
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
      <Form onSubmit={handleSubmit} isRequired>
        {(<TextField label="title" onChange={setTitle} value={title} />) as any}
        <TextField label="tags" onChange={setTags} value={tags} />
        <TextArea label="content" onChange={setTil} height="60vh" value={til} />
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
      {postState && postState.error && (
        <div>送信error {JSON.stringify(postState.error)}</div>
      )}
    </View>
  );
};
