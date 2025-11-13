import { useRef } from 'react';
import { BsCamera } from 'react-icons/bs';
import styles from './styles.module.css';

export default function ImageUploadField({
    imageFile,
    setImageFile,
    label,
    isSubmitting,
    isCircular = false,
    required = false
}) {
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const triggerFileInput = () => {
        if (!isSubmitting) {
            fileInputRef.current.click();
        }
    }

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
                required={required}
            />

            <div className={placeholderClass} onClick={triggerFileInput}>
                {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className={styles.uploadedImage} />
                ) : (
                    <>
                        <BsCamera size={30} color="var(--label-color)" />
                        <p className={styles.uploadLabel}>Adicionar {label}</p> 
                    </>
                )}
            </div>
            <p className={styles.externalMessage}>{label}{required && '*'}</p>
        </div>
    );
}