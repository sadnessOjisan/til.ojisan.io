import { Flex } from "@react-spectrum/layout";
import { View } from "@react-spectrum/view";
import Add from "@spectrum-icons/workflow/Add";
import { h } from "preact";
import Router, { Link, Route } from "preact-router";
import { Edit } from "./edit";
import { New } from "./new";
import { Posts } from "./posts";
import "../infra/firebase";
import { useEffect, useState } from "preact/hooks";
import { auth, GhProvider } from "../infra/firebase";
import { getHost } from "../util/getHost";
import { AuthTokenContext } from "../context/auth";
import { ENDPOINT } from "endpoint/src";

export const Root = () => {
  const [session, setSession] = useState<firebase.default.User | undefined>(
    undefined
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setSession(user);
      } else {
        auth.signInWithPopup(GhProvider);
      }
    });
  }, []);

  useEffect(() => {
    if (session === undefined) return;
    session.getIdToken().then((token) => {
      fetch(`${getHost()}/${ENDPOINT.checkAdminOrNot}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        setSession(undefined);
      });
    });
  }, [session]);

  return (
    <View>
      {session ? (
        <AuthTokenContext.Provider value={session}>
          <Flex
            height="60px"
            alignItems="center"
            justifyContent="space-between"
          >
            <View>
              <Link href="/">admin</Link>
            </View>
            <View>
              <Link href="/new">
                <Add />
              </Link>
            </View>
          </Flex>
          <Router>
            <Route path="/new" component={New} />
            <Route path="/edit/:id" component={Edit} />
            <Route path="/" component={Posts} />
          </Router>
        </AuthTokenContext.Provider>
      ) : (
        <div>Please Sign in</div>
      )}
    </View>
  );
};
