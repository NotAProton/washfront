export function getSlotLabel(slotno) {
    if (slotno < 30) {
        slotno = slotno % 6
        switch (slotno) {
            case 1:
                return '7AM-9AM';
                break;
            case 2:
                return '3PM-5PM';
                break;
            case 3:
                return '5PM-7PM';
                break
            case 4:
                return '7PM-9PM';
                break
            case 5:
                return '9PM-11PM';
                break
            case 0:
                return '11PM-1AM';
                break
        }
    } else {
        slotno -= 30
        slotno = slotno % 8
        switch (slotno) {
            case 1:
                return '7AM-9AM';
                break;
            case 2:
                return '9AM-11AM';
                break;
            case 3:
                return '11AM-1PM';
                break
            case 4:
                return '1PM-3PM';
                break
            case 5:
                return '3PM-5PM';
                break
            case 6:
                return '5PM-7PM';
                break
            case 7:
                return '7PM-9PM';
                break
            case 0:
                return '9PM-11PM';
                break
        }
    }
}

//export an array of slots
export const weekDaySlots = ['7AM-9AM', '3PM-5PM', '5PM-7PM', '7PM-9PM', '9PM-11PM', '11PM-1AM']
export const weekEndSlots = ['7AM-9AM', '9AM-11AM', '11AM-1PM', '1PM-3PM', '3PM-5PM', '5PM-7PM', '7PM-9PM', '9PM-11PM']
export function getCurrentSlot(data) {
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < weekDaySlots.length; i++) {
        const slot = weekDaySlots[i];
        const [start, end] = slot.split('-').map(time => {
            const [hour, period] = time.split(/(\d+)/).filter(Boolean);
            return period === 'AM' ? parseInt(hour) : parseInt(hour) + 12;
        });

        if (currentHour >= start && currentHour < end) {
            return slot;
        }

        if (currentHour < start) {
            return slot;
        }
    }

    return 'No slots available today';

}

function getCurrentDay() {
    let date = new Date();
    let hours = date.getHours();
    let day = date.getDay();

    // If the time is between 12 AM and 6 AM, adjust the day to the previous day
    if (hours < 6) {
        day--;
        if (day < 0) {
            day = 6; // If it's Sunday, adjust to Saturday
        }
    }

    return day === 0 ? 7 : day;

}

export function emptyDaySlotArray() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let week = [];
    let totalSlot = 1

    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const slots = [];
        const slotCount = (day === 'Saturday' || day === 'Sunday') ? 8 : 6;

        for (let j = 1; j <= slotCount; j++) {
            slots.push({ label: getSlotLabel(totalSlot), slotno: totalSlot, status: 'free' });
            totalSlot++
        }

        week.push({ day: day, slots: slots });
    }

    week = week.concat(week.slice(0, (getCurrentDay() - 1)));
    week.splice(0, (getCurrentDay() - 1));

    return week;
}

export const getDayFromSlotNo = (slotNo) => {
    if (slotNo >= 1 && slotNo <= 6) return 'Monday';
    if (slotNo >= 7 && slotNo <= 12) return 'Tuesday';
    if (slotNo >= 13 && slotNo <= 18) return 'Wednesday';
    if (slotNo >= 19 && slotNo <= 24) return 'Thursday';
    if (slotNo >= 25 && slotNo <= 30) return 'Friday';
    if (slotNo >= 31 && slotNo <= 38) return 'Saturday';
    if (slotNo >= 39 && slotNo <= 46) return 'Sunday';
};

