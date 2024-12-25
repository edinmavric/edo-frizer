const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');

const now = new Date();
const currentDate = now.toISOString().split('T')[0];

if (dateInput) dateInput.min = currentDate;

if (timeInput) {
    const roundToNext30Minutes = date => {
        const minutes = date.getMinutes();
        const nextInterval = Math.ceil(minutes / 30) * 30;
        date.setMinutes(nextInterval);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    const nextValidTime = roundToNext30Minutes(new Date());
    const hours = String(nextValidTime.getHours()).padStart(2, '0');
    const minutes = String(nextValidTime.getMinutes()).padStart(2, '0');
    timeInput.min = `${hours}:${minutes}`;

    timeInput.addEventListener('input', e => {
        const value = e.target.value;
        const [hour, minute] = value.split(':').map(Number);
        if (minute % 30 !== 0) {
            const adjustedMinutes = Math.round(minute / 30) * 30;
            e.target.value = `${String(hour).padStart(2, '0')}:${String(
                adjustedMinutes
            ).padStart(2, '0')}`;
        }
    });
}
