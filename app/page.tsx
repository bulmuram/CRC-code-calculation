"use client";

import Link from "next/link";
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
  const [data, setData] = useState<BinaryList>([
    1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0,
  ]);
  const [key, setKey] = useState<BinaryList>([1, 0, 1, 0, 1]);
  const [crcCode, setCrcCode] = useState<BinaryList>();
  const [drawAnswerBox, setDrawAnswerBox] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });
  const answerBoxLeft = useRef(null);
  const answerBoxRight = useRef(null);

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
  }, [key, data]);

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
  }, [key, data]);

  return (
    <div className="w-full min-h-screen p-20 relative">
      <div className="flex items-end justify-between">
        <div className="flex gap-5">
          <div className="w-sm">
            <label
              htmlFor="data-input"
              className="block mb-2 text-sm font-medium text-white"
            >
              Data:
            </label>
            <input
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-1\b]+$/.test(value[value.length - 1])) {
                  if (value.length > data.length) {
                    setData((p) => [...p, +value[value.length - 1] as Binary]);
                  } else {
                    setData((p) => [...p.slice(0, p.length - 1)]);
                  }
                }
              }}
              value={Number(data.toString().replaceAll(",", ""))}
              type="number"
              id="data-input"
              className="block w-full p-2 text-xs bg-gray-800 rounded-md focus-within:ring ring-indigo-500! outline-0! tracking-[0.3rem]"
            />
          </div>
          <div className="w-sm">
            <label
              htmlFor="key-input"
              className="block mb-2 text-sm font-medium text-white"
            >
              Key:
            </label>
            <input
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-1\b]+$/.test(value[value.length - 1])) {
                  if (value.length > key.length) {
                    setKey((p) => [...p, +value[value.length - 1] as Binary]);
                  } else {
                    setKey((p) => [...p.slice(0, p.length - 1)]);
                  }
                }
              }}
              value={Number(key.toString().replaceAll(",", ""))}
              type="number"
              id="key-input"
              className="block w-full p-2 text-xs bg-gray-800 rounded-md focus-within:ring ring-indigo-500! outline-0! tracking-[0.3rem]"
            />
          </div>
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
      <div className="w-fit **:ml-8 ml-8 mt-10">
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
              <div
                style={{
                  width: `${drawAnswerBox.right - drawAnswerBox.left + 10}px`,
                  height: `${drawAnswerBox.bottom - drawAnswerBox.top + 10}px`,
                  left: `${drawAnswerBox.left - 5}px`,
                  top: `${drawAnswerBox.top - 5}px`,
                  opacity: +level <= showLevel && values.answer ? "100%" : "0",
                }}
                className="absolute border border-indigo-500 rounded-md bg-indigo-950 transition duration-500"
              />

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
      <Link
        className="absolute right-10 bottom-10 flex items-center gap-1 py-2 px-4 rounded-md bg-neutral-100 w-fit text-black text-sm"
        href={"https://github.com/bulmuram/CRC-code-calculation"}
        target="_blank"
      >
        <svg
          className="size-5"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 496 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
        </svg>
        <span>Source code</span>
      </Link>
    </div>
  );
}
