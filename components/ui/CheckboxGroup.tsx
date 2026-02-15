
import { twMerge } from 'tailwind-merge';

interface CheckboxGroupProps {
    name: string;
    options: string[];
    value: string[]; // Array of selected values
    onChange: (value: string[]) => void;
    className?: string;
    error?: boolean;
}

export const CheckboxGroup = ({
    name,
    options,
    value,
    onChange,
    className,
    error
}: CheckboxGroupProps) => {
    const handleChange = (option: string, checked: boolean) => {
        if (checked) {
            onChange([...value, option]);
        } else {
            onChange(value.filter((v) => v !== option));
        }
    };

    return (
        <div className={twMerge("space-y-3", className)}>
            {options.map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name={name}
                        value={option}
                        checked={value.includes(option)}
                        onChange={(e) => handleChange(option, e.target.checked)}
                        className={twMerge(
                            "w-5 h-5 text-[#673ab7] border-gray-400 rounded focus:ring-[#673ab7] cursor-pointer accent-[#673ab7]",
                            error ? "accent-red-500" : ""
                        )}
                    />
                    <span className="text-[#202124] text-sm group-hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                        {option}
                    </span>
                </label>
            ))}
        </div>
    );
};
