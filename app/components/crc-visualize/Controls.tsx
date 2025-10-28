import { Dispatch, SetStateAction } from "react";
import Input from "./Input";

const Controls = ({
  updateData,
  updateKey,
  setShowLevel,
  dataInputValue,
  keyInputValue,
}: {
  updateData: (d: string) => void;
  updateKey: (d: string) => void;
  setShowLevel: Dispatch<SetStateAction<number>>;
  dataInputValue: number;
  keyInputValue: number;
}) => {
  return (
    <div className="flex items-end justify-between">
      <div className="flex gap-5">
        <Input
          id="data-input"
          label="Data"
          onChange={updateData}
          value={dataInputValue}
        />
        <Input
          id="key-input"
          label="Key"
          onChange={updateKey}
          value={keyInputValue}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setShowLevel((p) => p + 1)}
          className="cursor-pointer rounded-md bg-indigo-700 px-3 py-1 text-sm text-white transition active:scale-[.95]"
        >
          Next
        </button>
        <button
          onClick={() => setShowLevel(0)}
          className="cursor-pointer rounded-md bg-orange-700 px-3 py-1 text-sm text-white transition active:scale-[.95]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Controls;
