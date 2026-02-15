
import React, { SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: string[];
    placeholder?: string;
    error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder = "Choose", error, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                <select
                    ref={ref}
                    className={twMerge(
                        "w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none transition-colors appearance-none cursor-pointer text-[#202124]",
                        error ? "border-red-500" : "focus:border-[#673ab7]",
                        className
                    )}
                    {...props}
                >
                    <option value="" disabled selected hidden>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {/* Helper arrow icon */}
                <div className="absolute right-0 top-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {/* Animated focus underline */}
                <div
                    className={twMerge(
                        "absolute bottom-0 left-0 h-[2px] bg-[#673ab7] transition-all duration-300 w-0 group-focus-within:w-full",
                        error ? "bg-red-500" : ""
                    )}
                />
            </div>
        );
    }
);

Select.displayName = 'Select';
