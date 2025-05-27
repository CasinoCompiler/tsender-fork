import React from "react";

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    type?: string;
    large?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * A reusable input field component
 * @param label - Label for the input field
 * @param placeholder - Placeholder text
 * @param value - Current input value
 * @param type - Input type (default: "text")
 * @param large - Whether to use a larger textarea (default: false)
 * @param onChange - Function called when input value changes
 */
const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    type = "text",
    large = false,
    onChange,
}) => {
    const id = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <div className="flex flex-col space-y-2 w-full">
            <label htmlFor={id} className="font-medium text-sm">
                {label}
            </label>

            {large ? (
                <textarea
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-32 resize-none"
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
            )}
        </div>
    );
};

export default InputField;