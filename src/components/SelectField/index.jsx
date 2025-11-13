export default function SelectField({
    label,
    id,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    ...rest
}) {
    return (
        <div>
            <label htmlFor={id} className="label">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="input-field"
                {...rest}
            >
                <option value="" disabled>Selecione uma opção</option>
                {options.map(option => (
                    <option key={option.key} value={option.key}>
                        {option.displayName}
                    </option>
                ))}
            </select>
        </div>
    );
}