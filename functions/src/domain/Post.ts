import { Tag } from "./tag";

export class Post {
  private _content: string;
  private _timeStamp: Date; // TODO: ISO型を作る
  private _id: string;
  private _title: string;
  private _tags: Tag[];
  private _show: boolean;

  private constructor(arg: {
    content: string;
    timeStamp: Date; // TODO: ISO型を作る
    id: string;
    title: string;
    tags: Tag[];
    show: boolean;
  }) {
    this._content = arg.content;
    this._timeStamp = arg.timeStamp;
    this._id = arg.id;
    this._title = arg.title;
    this._tags = arg.tags;
    this._show = arg.show;
  }

  static createPost = (arg: {
    content: string;
    timeStamp: Date; // TODO: ISO型を作る
    id: string;
    title: string;
    tags: Tag[];
    show?: boolean;
  }) => {
    return new Post({ ...arg, show: arg.show ?? false });
  };

  get content() {
    return this._content;
  }
  get timeStamp() {
    return this._timeStamp;
  }
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get tags() {
    return this._tags;
  }
  get show() {
    return this._show;
  }
}
