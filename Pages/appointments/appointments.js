const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const form = document.querySelector('form');
const bookedTimesList = document.querySelector('#booked-times-list');
const bookedTimesSection = document.querySelector('#booked-times-section');

const now = new Date();
const currentDate = now.toISOString().split('T')[0];

const apiURL = 'https://wc-wd-api.onrender.com/api/frizer';

if (dateInput) dateInput.min = currentDate;

if (timeInput) {
    const roundToNext30Minutes = date => {
        const minutes = date.getMinutes();
        const nextInterval = Math.ceil(minutes / 30) * 30;
        if (nextInterval === 60) {
            date.setHours(date.getHours() + 1);
            date.setMinutes(0);
        } else {
            date.setMinutes(nextInterval);
        }
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    const fetchBookedTimes = async date => {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();

            const formattedDate = formatDate(date);
            return data[formattedDate] || [];
        } catch (error) {
            console.error('Error fetching booked times:', error);
            return [];
        }
    };

    const formatToAMPM = time => {
        const [hour, minute] = time.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${String(minute).padStart(2, '0')} ${period}`;
    };

    const displayBookedTimes = async date => {
        const bookedTimes = await fetchBookedTimes(date);

        bookedTimesList.innerHTML = '';

        if (bookedTimes.length === 0) {
            const noBookingsMessage = document.createElement('li');
            noBookingsMessage.setAttribute(
                'data-text-en',
                'No booked times for this date.'
            );
            noBookingsMessage.setAttribute(
                'data-text-sr',
                'Nema zauzetih termina za ovaj datum.'
            );

            const savedLanguage = localStorage.getItem('Language') || 'en';
            noBookingsMessage.textContent = noBookingsMessage.getAttribute(
                `data-text-${savedLanguage}`
            );

            bookedTimesList.appendChild(noBookingsMessage);

            return;
        }

        bookedTimes.sort((a, b) => {
            const [hourA, minuteA] = a.split(':').map(Number);
            const [hourB, minuteB] = b.split(':').map(Number);

            return hourA !== hourB ? hourA - hourB : minuteA - minuteB;
        });

        bookedTimes.forEach(time => {
            const li = document.createElement('li');
            li.textContent = formatToAMPM(time);
            li.className = 'booked-times-element';
            bookedTimesList.appendChild(li);
        });

        bookedTimesSection.style.display = 'block';
    };

    const setTimeConstraints = async () => {
        const selectedDate = new Date(dateInput.value);
        const now = new Date();

        await displayBookedTimes(dateInput.value);

        if (selectedDate.toDateString() === now.toDateString()) {
            const nextValidTime = roundToNext30Minutes(now);
            const hours = String(nextValidTime.getHours()).padStart(2, '0');
            const minutes = String(nextValidTime.getMinutes()).padStart(2, '0');
            timeInput.min = `${hours}:${minutes}`;
            console.log(`Min Time: ${formatToAMPM(`${hours}:${minutes}`)}`);
        } else {
            timeInput.min = '08:00';
        }
        timeInput.max = '20:00';
    };

    dateInput.addEventListener('change', setTimeConstraints);

    setTimeConstraints();

    timeInput.addEventListener('input', e => {
        const value = e.target.value;
        const [hour, minute] = value.split(':').map(Number);

        if (minute % 30 !== 0) {
            const adjustedMinutes = Math.round(minute / 30) * 30;
            const adjustedTime = new Date();
            adjustedTime.setHours(hour);
            adjustedTime.setMinutes(adjustedMinutes);
            adjustedTime.setSeconds(0);

            const hours = String(adjustedTime.getHours()).padStart(2, '0');
            const minutes = String(adjustedTime.getMinutes()).padStart(2, '0');
            e.target.value = `${hours}:${minutes}`;
        }
    });
}

const formatDate = date => {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
};

const checkAvailability = async (date, time) => {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        const formattedDate = formatDate(date);

        if (data[formattedDate] && data[formattedDate].includes(time)) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error fetching API data:', error);
        return false;
    }
};

const submitAppointment = async (date, time) => {
    try {
        const formattedDate = formatDate(date);

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: formattedDate, time }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit appointment');
        }
        window.location.href =
            '/edo-frizer/Pages/validation/appointment/validation.html';
    } catch (error) {
        console.error('Error submitting appointment:', error);
        alert('Failed to book the appointment. Please try again later.');
    }
};

form.addEventListener('submit', async e => {
    e.preventDefault();

    const selectedDate = dateInput.value;
    const selectedTime = timeInput.value;

    if (!selectedDate || !selectedTime) {
        alert('Please select both a date and time.');
        return;
    }

    const isAvailable = await checkAvailability(selectedDate, selectedTime);

    if (isAvailable) {
        await submitAppointment(selectedDate, selectedTime);
    } else {
        alert('This time slot is already taken. Please select another time.');
    }
});
