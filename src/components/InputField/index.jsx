export default function InputField({
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
    disabled = false,
    placeholder = ' ',
    isCurrency = false,
    ...rest
}) {

    const handleKeyDown = (e) => {
        const allowedKeys = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', ','];

        if (allowedKeys.includes(e.key) || (e.key >= '0' && e.key <= '9')) {
            const isDecimal = e.key === '.' || e.key === ',';
            if (isDecimal && (value.includes('.') || value.includes(','))) {
                 e.preventDefault();
            }
            return; 
        }

        e.preventDefault();
    }

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
                onKeyDown={isCurrency ? handleKeyDown : undefined}
                {...rest}
            />
        </div>
    );
}