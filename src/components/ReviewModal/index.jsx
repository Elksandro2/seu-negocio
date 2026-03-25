import { useState } from "react";
import styles from "./styles.module.css";
import { Star, StarFill } from "react-bootstrap-icons";
import MessagePopUp from "../MessagePopUp";

export default function ReviewModal({ isOpen, onClose, onSave, item }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);

    const ratings = [1, 2, 3, 4, 5];

    if (!isOpen) return null;

    const getRatingLabel = (value) => {
        const labels = { 1: 'Péssimo', 2: 'Ruim', 3: 'Regular', 4: 'Bom', 5: 'Excelente' }
        return labels[value] ?? '';
    };

    const handleSave = () => {
        if (rating === 0) {
            setShowMessagePopUp(true)
            return
        }
        onSave({ rating, comment })
    }

    return (
        <div className={`modal show d-block ${styles.modalOverlay}`}>
            <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content ${styles.customContent}`}>
                    <div className={`modal-header ${styles.header}`}>
                        <h3 className={styles.title}>Avaliação do Produto</h3>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div>
                            <img src={item?.imageUrls?.[0]} alt={item?.name} className={styles.productImage} />
                        </div>

                        <div className={styles.productText}>
                            <p className={styles.productName}>{item?.name || 'Nome do Produto'}</p>
                            <p className={styles.storeName}>{item?.business?.name || 'Loja Parceira'}</p>
                        </div>

                        <div className={styles.ratingSection}>
                            <span className={styles.label}>Satisfação:</span>
                            <div className={styles.starContainer}>
                                {ratings.map((star) => (
                                    <div
                                        key={star}
                                        className={styles.starWrapper}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        {(hover || rating) >= star ? (
                                            <StarFill className={styles.starIconActive} />
                                        ) : (
                                            <Star className={styles.starIcon} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <span className={styles.ratingLabel}>{getRatingLabel(hover || rating)}</span>
                        </div>

                        <div className={styles.commentSection}>
                            <label className={styles.label}>Comentário (Opcional):</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Conte sua experiência..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className={`modal-footer ${styles.footer}`}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                        <button type="button" className={styles.saveBtn} onClick={handleSave}>Avaliar</button>
                    </div>
                </div>
            </div>

            {showMessagePopUp && (
                <MessagePopUp
                    message="Selecione uma nota de satisfação."
                    showPopUp={setShowMessagePopUp}
                    severity="danger"
                />
            )}
        </div>
    )
}