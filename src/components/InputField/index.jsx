export default function InputField({
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
    disabled = false,
    placeholder = ' ',
    ...rest
}) {
    return (
        <div>
            <label htmlFor={id} className="label">{label}</label>
            
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className="input-field"
                {...rest}
            />
        </div>
    );
}