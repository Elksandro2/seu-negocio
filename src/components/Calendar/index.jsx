import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles.module.css";
import MessagePopUp from "../MessagePopUp";

export default function Scheduler({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  const [showMessagePopUp, setShowMessagePopUp] = useState(false);

  const availableTimes = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ];

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (!selectedTime) {
      setShowMessagePopUp(true);
      return;
    }
    // Terminar a lógica
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            Escolha a data e hora para agendar o serviço
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            X
          </button>
        </div>

        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            className={styles.customCalendar}
          />
        </div>

        <div className={styles.timeSection}>
          <h4 className={styles.timeTitle}>Horários Disponíveis</h4>
          <div className={styles.timeGrid}>
            {availableTimes.map((time, index) => (
              <button
                key={index}
                className={`${styles.timeSlot} ${selectedTime === time ? styles.selectedSlot : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.scheduleBtn} onClick={handleSchedule}>
            Agendar
          </button>
        </div>
      </div>

      {showMessagePopUp && (
        <MessagePopUp
          message="Selecione um horário"
          showPopUp={setShowMessagePopUp}
          severity="danger"
        />
      )}
    </div>
  );
}
