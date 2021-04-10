export const parseBody = (body: any): ParsedBody => {
  try {
    return JSON.parse(body) as ParsedBody;
  } catch (e) {
    throw new Error("body parse error");
  }
};

type ParsedBody = any;
