import { _isValidSaveRequestBody } from "./index";

describe("validation", () => {
  describe("_isValidSaveRequestBody", () => {
    test("ok", () => {
      const actual = _isValidSaveRequestBody({
        content: "hoge",
        tags: ["hoge", "fuga"],
      });
      expect(actual).toBe(true);
    });

    test("undefined is ng", () => {
      const actual = _isValidSaveRequestBody(undefined);
      expect(actual).toBe(false);
    });

    test("content should be string", () => {
      const actual = _isValidSaveRequestBody({ content: 1 });
      expect(actual).toBe(false);
    });
  });
});
