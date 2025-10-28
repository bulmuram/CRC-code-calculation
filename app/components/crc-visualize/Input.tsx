import { InputType } from "@/app/hooks/crc-visualize/types";

const Input = ({ label, id, onChange, value }: InputType) => {
  return (
    <div className="w-sm">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-white">
        {label}:
      </label>
      <input
        onChange={(e) => onChange(e.target.value)}
        value={value}
        type="number"
        id={id}
        className="block w-full p-2 text-xs bg-gray-800 rounded-md focus-within:ring ring-indigo-500! outline-0! tracking-[0.3rem]"
      />
    </div>
  );
};

export default Input;
