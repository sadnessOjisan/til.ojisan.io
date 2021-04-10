export class Tag {
  private _name: string;
  private _timeStamp: Date; // TODO: ISO型を作る
  private _id: string;

  private constructor(arg: {
    name: string;
    timeStamp: Date; // TODO: ISO型を作る
    id: string;
  }) {
    this._name = arg.name;
    this._timeStamp = arg.timeStamp;
    this._id = arg.id;
  }

  static createTag = (arg: {
    name: string;
    timeStamp: Date; // TODO: ISO型を作る
    id: string;
  }) => {
    return new Tag(arg);
  };
}
