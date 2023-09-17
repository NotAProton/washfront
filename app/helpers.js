export function getSlotLabel (slotno) {
  if (slotno < 30) {
    slotno = slotno % 6
    switch (slotno) {
      case 1:
        return '7AM-9AM'

      case 2:
        return '3PM-5PM'

      case 3:
        return '5PM-7PM'

      case 4:
        return '7PM-9PM'

      case 5:
        return '9PM-11PM'

      case 0:
        return '11PM-1AM'
    }
  } else {
    slotno -= 30
    slotno = slotno % 8
    switch (slotno) {
      case 1:
        return '7AM-9AM'

      case 2:
        return '9AM-11AM'

      case 3:
        return '11AM-1PM'

      case 4:
        return '1PM-3PM'

      case 5:
        return '3PM-5PM'

      case 6:
        return '5PM-7PM'

      case 7:
        return '7PM-9PM'

      case 0:
        return '9PM-11PM'
    }
  }
}

// export an array of slots
export const weekDaySlots = ['7AM-9AM', '3PM-5PM', '5PM-7PM', '7PM-9PM', '9PM-11PM', '11PM-1AM']
export const weekEndSlots = ['7AM-9AM', '9AM-11AM', '11AM-1PM', '1PM-3PM', '3PM-5PM', '5PM-7PM', '7PM-9PM', '9PM-11PM']

function getCurrentDay () {
  const date = new Date()
  const hours = date.getHours()
  let day = date.getDay()

  // If the time is between 12 AM and 6 AM, adjust the day to the previous day
  if (hours < 6) {
    day--
    if (day < 0) {
      day = 6 // If it's Sunday, adjust to Saturday
    }
  }

  return day === 0 ? 7 : day
}

export function getCurrentSlotInfo (slots) {
  // Get current time
  const now = new Date()
  const currentHour = now.getHours()

  // Special case for time between 1AM and 6AM
  if (currentHour >= 1 && currentHour < 6) {
    return ['noSlots', null]
  }

  for (let i = 0; i < slots.length; i++) {
    // Extract start and end times from slot label
    const times = slots[i].label.split('-')
    const startHour = convertTo24Hours(times[0])
    const endHour = convertTo24Hours(times[1])

    // Check if current time falls within slot time
    if (currentHour >= startHour && currentHour < endHour) {
      if (i === slots.length - 1) {
        return [slots[i], null]
      }
      return [slots[i], slots[i + 1]]
    }
  }

  // Special case for slot between 11PM and 1AM
  if (currentHour >= 23 || currentHour < 1) {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].label === '11PM-1AM') {
        return [slots[i], null]
      }
    }
    return [null, null]
  }

  // If no slot found, return "no more slots today"
  return [null, null]
}

export function emptyDaySlotArray () {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  let week = []
  let totalSlot = 1

  for (let i = 0; i < days.length; i++) {
    const day = days[i]
    const slots = []
    const slotCount = (day === 'Saturday' || day === 'Sunday') ? 8 : 6

    for (let j = 1; j <= slotCount; j++) {
      slots.push({ label: getSlotLabel(totalSlot), slotno: totalSlot, status: 'free' })
      totalSlot++
    }

    week.push({ day, slots })
  }

  week = week.concat(week.slice(0, (getCurrentDay() - 1)))
  week.splice(0, (getCurrentDay() - 1))

  return week
}

export const getDayFromSlotNo = (slotNo) => {
  if (slotNo >= 1 && slotNo <= 6) return 'Monday'
  if (slotNo >= 7 && slotNo <= 12) return 'Tuesday'
  if (slotNo >= 13 && slotNo <= 18) return 'Wednesday'
  if (slotNo >= 19 && slotNo <= 24) return 'Thursday'
  if (slotNo >= 25 && slotNo <= 30) return 'Friday'
  if (slotNo >= 31 && slotNo <= 38) return 'Saturday'
  if (slotNo >= 39 && slotNo <= 46) return 'Sunday'
}

export function compileWeekList (serverData, emptyDaySlotArray) {
  serverData.forEach(item => {
    emptyDaySlotArray.forEach(obj => {
      if (obj.slots) {
        obj.slots.forEach(slot => {
          if (slot.slotno === item.slotno) {
            slot.status = 'booked'
            slot.bookedBy = item.mailID
          }
        })
      }
    })
  })
  return emptyDaySlotArray
}

function convertTo24Hours (time) {
  const hourregex = /[0-9]+/
  const ampmregex = /[a-zA-Z]+/
  const hour = time.match(hourregex)[0]
  const ampm = time.match(ampmregex)[0]
  if ((ampm === 'PM' || ampm === 'pm') && hour !== '12') {
    return parseInt(hour) + 12
  }
  return parseInt(hour)
}

export function getDateFromSlotID (slotID) {
  if (!slotID) return
  function getNearestDate (dayOfWeek) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = new Date()
    let todayIndex = today.getDay()
    if (today.getHours() < 6) {
      todayIndex--
    }
    const dayIndex = days.indexOf(dayOfWeek.toLowerCase())

    if (dayIndex === -1) {
      return 'Invalid day of the week'
    }

    const diff = dayIndex - todayIndex

    let nearestDate
    if (diff >= 0) {
      nearestDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diff)
    } else {
      nearestDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diff + 7)
    }

    const date = nearestDate.getDate()
    const month = nearestDate.toLocaleString('default', { month: 'short' })

    return `${date} ${month}`
  }
  const day = getDayFromSlotNo(slotID)

  return getNearestDate(day)
}

export function formatName (str) {
  const nameRegex = /^[a-zA-Z]*/
  let name = str.match(nameRegex)[0]
  name = name.charAt(0).toUpperCase() + name.slice(1)
  str = str.replace(nameRegex, '')

  const yearRegex = /[0-9]+/
  str = str.replace(yearRegex, '')

  let branch = str.match(nameRegex)[0]
  branch = branch.toUpperCase()
  str = str.replace(nameRegex, '')

  return name + ' (' + branch + '-' + str + ')'
}
