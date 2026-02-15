
import React, { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                <input
                    ref={ref}
                    className={twMerge(
                        "w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none transition-colors placeholder-gray-400 font-normal",
                        error ? "border-red-500" : "focus:border-[#673ab7]",
                        className
                    )}
                    {...props}
                />
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

Input.displayName = 'Input';
