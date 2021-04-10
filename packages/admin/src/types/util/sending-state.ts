type InitType = undefined;

type SendingType = {
  isPosted: false;
  error: undefined;
};

type SuccessType = {
  isPosted: true;
  error: undefined;
};

type FailType = {
  isPosted: true;
  error: string;
};

export type SendingStateType = InitType | SendingType | SuccessType | FailType;
