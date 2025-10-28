export type Binary = 1 | 0;
export type BinaryList = Binary[];
export type Levels = {
  [key: number]: {
    list: BinaryList;
    shiftIndex: number;
    answer: boolean;
  };
};

export type InputType = {
  label: string;
  id: string;
  onChange: (d: string) => void;
  value: number;
};
