"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const [crcCode, setCrcCode] = useState<BinaryList>();
  const [drawAnswerBox, setDrawAnswerBox] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });
  const answerBoxLeft = useRef(null);
  const answerBoxRight = useRef(null);
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

    setCrcCode(
      localLevels[data.length - key.length + 1].list.slice(
        data.length - key.length + 1
      )
    );
    return localLevels;
  }, []);

  useEffect(() => {
    if (!answerBoxLeft.current && !answerBoxRight.current) return;

    //@ts-expect-error never null
    const left = answerBoxLeft.current.getBoundingClientRect();
    //@ts-expect-error never null
    const right = answerBoxRight.current.getBoundingClientRect();

    setDrawAnswerBox({
      left: left.left,
      top: left.top,
      bottom: left.bottom,
      right: right.right,
    });
  }, [answerBoxLeft, answerBoxRight]);

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
            <div key={level}>
              {+level <= showLevel && values.answer && (
                <div
                  style={{
                    width: `${drawAnswerBox.right - drawAnswerBox.left + 10}px`,
                    height: `${
                      drawAnswerBox.bottom - drawAnswerBox.top + 10
                    }px`,
                    left: `${drawAnswerBox.left - 5}px`,
                    top: `${drawAnswerBox.top - 5}px`,
                  }}
                  className="absolute border border-indigo-500 rounded-md bg-indigo-950"
                />
              )}
              <div
                className={`transition duration-300 relative ${
                  +level <= showLevel ? "opacity-100" : "opacity-0"
                } `}
              >
                <div className="**:ml-8 ">
                  <div>
                    <span className="text-gray-600 absolute left-0">
                      {level}
                    </span>
                    {values.list.map((value, i) => (
                      <span
                        ref={
                          i === data.length - key.length + 1
                            ? answerBoxLeft
                            : i === data.length - 1
                            ? answerBoxRight
                            : undefined
                        }
                        className={
                          i < values.shiftIndex + 1
                            ? "relative text-red-300 before:absolute before:w-4 before:h-0.5 before:bg-red-300 before:-rotate-45 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2"
                            : !values.answer &&
                              i === values.list.length - 1 &&
                              i >= key.length
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
            </div>
          ))}
      </div>
    </div>
  );
}
