
import { twMerge } from 'tailwind-merge';

interface ScaleProps {
    name: string;
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
    value?: number;
    onChange: (value: number) => void;
    className?: string;
    error?: boolean;
}

export const Scale = ({
    name,
    min,
    max,
    minLabel,
    maxLabel,
    value,
    onChange,
    className,
    error
}: ScaleProps) => {
    const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
        <div className={twMerge("w-full overflow-x-auto pb-2", className)}>
            <div className="flex items-end justify-between min-w-[300px] gap-4">
                {minLabel && <span className="text-xs text-[#5f6368] mb-2">{minLabel}</span>}

                <div className="flex gap-4 sm:gap-8 justify-center flex-grow">
                    {range.map((num) => (
                        <label key={num} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <span className="text-sm text-[#202124]">{num}</span>
                            <input
                                type="radio"
                                name={name}
                                value={num}
                                checked={value === num}
                                onChange={() => onChange(num)}
                                className={twMerge(
                                    "w-5 h-5 text-[#673ab7] border-gray-400 focus:ring-[#673ab7] cursor-pointer accent-[#673ab7]",
                                    error ? "accent-red-500" : ""
                                )}
                            />
                        </label>
                    ))}
                </div>

                {maxLabel && <span className="text-xs text-[#5f6368] mb-2">{maxLabel}</span>}
            </div>
        </div>
    );
};
