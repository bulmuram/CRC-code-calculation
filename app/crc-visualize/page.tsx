"use client";
import Controls from "../components/crc-visualize/Controls";
import useCrcCalc from "../hooks/crc-visualize/useCrcCalc";

const CrcCalc = () => {
  const {
    data,
    key,
    levels,
    drawAnswerBox,
    answerBoxLeft,
    answerBoxRight,
    showLevel,
    controls,
  } = useCrcCalc();

  return (
    <div className="w-full min-h-screen p-20 relative">
      <Controls {...controls} />

      <div className="w-fit **:ml-8 ml-8 mt-10">
        {data.map((d, i) => (
          <span className="text-indigo-500" key={i}>
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
    </div>
  );
};

export default CrcCalc;
