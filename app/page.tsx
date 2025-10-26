"use client";

import { useMemo, useState } from "react";

type Binary = 1 | 0;
type BinaryList = Binary[];
type Levels = {
  [key: number]: {
    list: BinaryList;
    shiftIndex: number;
    answer: boolean;
  };
};

export default function Home() {
  const [showLevel, setShowLevel] = useState<number>(0);
  // const data: BinaryList = useMemo(() => [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1], []);
  const data: BinaryList = useMemo(() => [1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0], []);
  const key: BinaryList = useMemo(() => [1, 0, 1, 0, 1], []);

  const levels: Levels = useMemo(() => {
    const localLevels: Levels = {
      0: { list: data.slice(0, key.length), shiftIndex: -1, answer: false },
    };

    for (
      let shiftIndex = 0;
      shiftIndex <= data.length - key.length;
      shiftIndex++
    ) {
      let result: BinaryList;

      const currentLocalLevel: BinaryList = JSON.parse(
        JSON.stringify(localLevels[shiftIndex].list)
      );

      const selectedData: Binary = data[key.length + shiftIndex];

      if (currentLocalLevel[shiftIndex] === 1) {
        const xorData = currentLocalLevel.map((data, i) => {
          if (i < shiftIndex) {
            return 0;
          }

          if (key[i - shiftIndex] + data === 1) {
            return 1;
          } else {
            return 0;
          }
        });

        if (selectedData !== undefined) {
          result = [...xorData, selectedData];
        } else {
          result = xorData;
        }
      } else {
        if (selectedData !== undefined) {
          result = [...currentLocalLevel, selectedData];
        } else {
          result = currentLocalLevel;
        }
      }

      localLevels[shiftIndex + 1] = {
        list: result,
        shiftIndex,
        answer: shiftIndex + key.length === data.length,
      };
    }

    return localLevels;
  }, []);

  return (
    <div className="w-full min-h-screen p-20 ">
      <div className="flex items-center justify-end gap-2 mb-5">
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
      <div className="w-fit **:ml-8 ml-8 ">
        {data.map((d) => (
          <span className="text-indigo-500" key={Math.random()}>
            {d}
          </span>
        ))}
      </div>

      <div className="w-fit">
        {data.length > 0 &&
          Object.entries(levels).map(([level, values]) => (
            <div
              key={level}
              className={`transition duration-300 relative ${
                +level <= showLevel ? "opacity-100" : "opacity-0"
              } `}
            >
              <div className="**:ml-8 ">
                <div>
                  <span className="text-gray-600 absolute left-0">{level}</span>
                  {values.list.map((value, i) => (
                    <span
                      className={
                        i < values.shiftIndex + 1
                          ? "relative text-red-300 before:absolute before:w-4 before:h-0.5 before:bg-red-300 before:-rotate-45 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2"
                          : values.answer
                          ? "underline text-indigo-500"
                          : i === values.list.length - 1 && i >= key.length
                          ? "text-emerald-500"
                          : "text-white"
                      }
                      key={i}
                    >
                      {value}
                    </span>
                  ))}
                </div>
                {data.length > 0 && !values.answer && (
                  <div className="relative text-gray-600">
                    <span className="absolute -left-12 text-sm">Key:</span>
                    {Array.from({ length: +level }).map((_, i) => (
                      <span className="opacity-0" key={i}>
                        0
                      </span>
                    ))}
                    {key.map((value, i) => (
                      <span key={i}>{value}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
