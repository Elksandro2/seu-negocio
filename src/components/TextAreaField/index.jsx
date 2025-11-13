export default function TextAreaField({
    label,
    id,
    value,
    onChange,
    required = false,
    disabled = false,
    rows = 3,
    ...rest
}) {
    return (
        <div>
            <label htmlFor={id} className="label">{label}</label>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="input-field"
                rows={rows}
                {...rest}
            />
        </div>
    );
}