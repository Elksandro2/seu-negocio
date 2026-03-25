import { useRef } from 'react';
import { BsCamera } from 'react-icons/bs';
import styles from './styles.module.css';
import { X } from 'react-bootstrap-icons';

export default function ImageUploadField({
    imageFile,
    setImageFile,
    label,
    isSubmitting,
    isCircular = false,
    required = false,
    multiple = false,
    maxFiles = 5
}) {
    const fileInputRef = useRef(null);

    const files = multiple ? (imageFile || []) : (imageFile ? [imageFile] : []);

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        if (multiple) {
            const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
            setImageFile(newFiles);
        } else {
            setImageFile(selectedFiles[0]);
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemove = (indexToRemove, e) => {
        e.stopPropagation();
        if (multiple) {
            setImageFile(files.filter((_, index) => index !== indexToRemove));
        } else {
            setImageFile(null);
        }
    };

    const triggerFileInput = () => {
        if (!isSubmitting && files.length < (multiple ? maxFiles : 1)) {
            fileInputRef.current.click();
        }
    };

    const placeholderClass = isCircular ? styles.imagePlaceholderCircular : styles.imagePlaceholder;

    return (
        <div className={styles.uploadContainer}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
                accept="image/*"
                disabled={isSubmitting}
                required={required && files.length === 0}
                multiple={multiple}
            />

            <div className={styles.previewGrid}>
                {files.map((file, index) => (
                    <div key={index} className={placeholderClass} style={{ cursor: 'default' }}>
                        <img src={URL.createObjectURL(file)} alt="Preview" className={styles.uploadedImage} />
                        {!isSubmitting && (
                            <button type="button" className={styles.removeBtn} onClick={(e) => handleRemove(index, e)}>
                                <X size={20} />
                            </button>
                        )}
                    </div>
                ))}

                {files.length < (multiple ? maxFiles : 1) && (
                    <div className={placeholderClass} onClick={triggerFileInput}>
                        <BsCamera size={30} color="var(--label-color)" />
                        <p className={styles.uploadLabel}>
                            {files.length > 0 ? 'Adicionar mais' : `Adicionar ${label}`}
                        </p>
                    </div>
                )}
            </div>

            <p className={styles.externalMessage}>{label}{required && '*'}</p>
            {multiple && <small className={styles.helperText}>Máximo de {maxFiles} fotos.</small>}
        </div>
    );
}