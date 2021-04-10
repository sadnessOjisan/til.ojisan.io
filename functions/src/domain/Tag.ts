export class Tag {
  private _content: string;
  private _timeStamp: string; // TODO: ISO型を作る
  private _id: string;

  private constructor(arg: {
    content: string;
    timeStamp: string; // TODO: ISO型を作る
    id: string;
  }) {
    this._content = arg.content;
    this._timeStamp = arg.timeStamp;
    this._id = arg.id;
  }

  static createTag = (arg: {
    content: string;
    timeStamp: string; // TODO: ISO型を作る
    id: string;
  }) => {
    return new Tag(arg);
  };
}
