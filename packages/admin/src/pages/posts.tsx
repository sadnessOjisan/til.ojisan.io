import { ActionButton, Button } from "@react-spectrum/button";
import { ButtonGroup } from "@react-spectrum/buttongroup";
import { Dialog, DialogTrigger } from "@react-spectrum/dialog";
import { Divider } from "@react-spectrum/divider";
import { Flex } from "@react-spectrum/layout";
import { ProgressCircle } from "@react-spectrum/progress";
import { Switch } from "@react-spectrum/switch";
import { Heading, Text } from "@react-spectrum/text";
import { Content, Header, View } from "@react-spectrum/view";
import { h } from "preact";
import { Link, route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { Post } from "../types/Post";
import { getHost } from "../util/getHost";
import type { SendingStateType } from "../types/util/sending-state";
import { ENDPOINT } from "endpoint/src";
import { useAuthTokenContext } from "../context/auth";

type PostState =
  | undefined
  | { isLoading: true; data: undefined; error: undefined }
  | {
      isLoading: false;
      data: Post[];
      error: undefined;
    }
  | {
      isLoading: false;
      data: undefined;
      error: string;
    };

export const Posts = () => {
  const session = useAuthTokenContext();
  const [data, setData] = useState<PostState>(undefined);
  const [flgSendingState, setFlgSendintState] = useState<SendingStateType>(
    undefined
  );

  useEffect(() => {
    setData({ isLoading: true, data: undefined, error: undefined });
    fetch(`${getHost()}/${ENDPOINT.getAllPosts}`)
      .then((res) => {
        res.json().then((data) => {
          // TODO: validation
          setData({ isLoading: false, data: data, error: undefined });
        });
      })
      .catch((e) => {
        setData({ isLoading: false, data: undefined, error: e.message });
      });
  }, []);

  const handleCheckFlg = (pid: string, nextState: boolean) => {
    setFlgSendintState({ isPosted: false, error: undefined });
    if (session === undefined) throw new Error("should login");
    session?.getIdToken().then((token) => {
      fetch(`${getHost()}/${ENDPOINT.setShowFlg}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ show: nextState, post_id: pid }),
      })
        .then((res) => {
          setFlgSendintState({ isPosted: true, error: undefined });
        })
        .catch((e) => {
          setFlgSendintState({
            isPosted: true,
            error: "flgの保存に失敗しました。",
          });
        });
    });
  };

  return (
    <div>
      {data === undefined || data.isLoading ? (
        <Flex justifyContent="center">
          <ProgressCircle aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        data !== undefined &&
        data.isLoading === false &&
        data.error === undefined &&
        data.data.map((d) => {
          const date = new Date(d.timeStamp);
          const dataString = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          return (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              marginY="12px"
            >
              <Flex alignItems="center">
                <Switch
                  onChange={(b: boolean) => handleCheckFlg(d.id, b)}
                  defaultSelected={d.show}
                />
                <Text marginX="4px">{dataString}</Text>
                <Text marginX="4px">{d.title}</Text>
              </Flex>
              <View>
                <ActionButton
                  onPress={() => {
                    route(`/edit/${d.id}`);
                  }}
                  variant="cta"
                >
                  edit
                </ActionButton>
                <DialogTrigger>
                  <ActionButton marginStart="8px" variant="negative">
                    Delete
                  </ActionButton>
                  {(close: any) => (
                    <Dialog>
                      <Heading>削除しますか？</Heading>
                      <Divider />
                      <Content>
                        <Text>Start speed test?</Text>
                      </Content>
                      <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                          Cancel
                        </Button>
                        <Button
                          variant="cta"
                          onPress={async () => {
                            const token = await session?.getIdToken();
                            fetch(`${getHost()}/deletePostById`, {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ id: d.id }),
                            }).catch((e) => console.error(e));
                            close();
                          }}
                        >
                          Confirm
                        </Button>
                      </ButtonGroup>
                    </Dialog>
                  )}
                </DialogTrigger>
              </View>
            </Flex>
          );
        })
      )}
    </div>
  );
};
