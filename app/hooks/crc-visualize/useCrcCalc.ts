import { useState, useRef, useMemo, useEffect } from "react";
import { BinaryList, Levels, Binary } from "./types";

const useCrcCalc = () => {
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

  const dataInputValue = Number(data.toString().replaceAll(",", ""));
  const keyInputValue = Number(key.toString().replaceAll(",", ""));

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

  const updateData = (value: string) => {
    if (/^[0-1\b]+$/.test(value[value.length - 1])) {
      if (value.length > data.length) {
        setData((p) => [...p, +value[value.length - 1] as Binary]);
      } else {
        setData((p) => [...p.slice(0, p.length - 1)]);
      }
    }
  };

  const updateKey = (value: string) => {
    if (/^[0-1\b]+$/.test(value[value.length - 1])) {
      if (value.length > key.length) {
        setKey((p) => [...p, +value[value.length - 1] as Binary]);
      } else {
        setKey((p) => [...p.slice(0, p.length - 1)]);
      }
    }
  };

  return {
    data,
    key,
    levels,
    drawAnswerBox,
    answerBoxLeft,
    answerBoxRight,
    showLevel,
    controls: {
      dataInputValue,
      keyInputValue,
      updateData,
      updateKey,
      setShowLevel,
    },
  };
};

export default useCrcCalc;
