import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// 1. Пошук елементів інтерфейсу
const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysRef = document.querySelector('[data-days]');
const hoursRef = document.querySelector('[data-hours]');
const minutesRef = document.querySelector('[data-minutes]');
const secondsRef = document.querySelector('[data-seconds]');

startBtn.disabled = true;

let userSelectedDate = null;
let timerInterval = null;

// 2. Ініціалізація календаря
flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
});

// 3. Функції форматування та конвертації
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// 4. Обробник кнопки "Start"
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = userSelectedDate - currentTime;

    if (deltaTime <= 0) {
      clearInterval(timerInterval);
      input.disabled = false;
      // Встановлюємо 00, коли таймер закінчився
      daysRef.textContent = '00';
      hoursRef.textContent = '00';
      minutesRef.textContent = '00';
      secondsRef.textContent = '00';
      return;
    }

    // Оновлення інтерфейсу
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    daysRef.textContent = addLeadingZero(days);
    hoursRef.textContent = addLeadingZero(hours);
    minutesRef.textContent = addLeadingZero(minutes);
    secondsRef.textContent = addLeadingZero(seconds);
  }, 1000);
});
