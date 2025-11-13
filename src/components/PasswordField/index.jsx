import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function PasswordField({
    label,
    id,
    value,
    onChange,
    required = false,
    disabled = false,
    ...rest
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label htmlFor={id} className="label">{label}</label>
            
            <div className="password-container">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className="input-field"
                    placeholder=" "
                    {...rest}
                />
                <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                </span>
            </div>
        </div>
    );
}