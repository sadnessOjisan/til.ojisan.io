import { h, render } from "preact";
import { Provider, defaultTheme } from "@adobe/react-spectrum";

import { Root } from "./pages/root";

render(
  <Provider theme={defaultTheme}>
    {/* TODO: spectrum 構文で書き換える */}
    <div style={{ minHeight: "100vh", maxWidth: "1024px", margin: "0 auto" }}>
      <Root />
    </div>
  </Provider>,
  document.body
);
