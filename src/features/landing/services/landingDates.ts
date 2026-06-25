function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentWeekMonday(date = new Date()) {
  const monday = new Date(date);
  const day = monday.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() + diffToMonday);

  return monday;
}

export function getLandingDateRange(date = new Date()) {
  const endDate = getCurrentWeekMonday(date);
  const startDate = new Date(endDate);

  startDate.setFullYear(startDate.getFullYear() - 5);

  return {
    startTime: formatLocalDate(startDate),
    endTime: formatLocalDate(endDate),
  };
}
