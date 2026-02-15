
import React, { TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                <textarea
                    ref={ref}
                    className={twMerge(
                        "w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none transition-colors resize-y min-h-[100px] placeholder-gray-400 font-normal",
                        error ? "border-red-500" : "focus:border-[#673ab7]",
                        className
                    )}
                    {...props}
                />
                {/* Animated focus underline */}
                <div
                    className={twMerge(
                        "absolute bottom-[6px] left-0 h-[2px] bg-[#673ab7] transition-all duration-300 w-0 group-focus-within:w-full", // Adjusted bottom for textarea margin/padding
                        error ? "bg-red-500" : ""
                    )}
                />
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
