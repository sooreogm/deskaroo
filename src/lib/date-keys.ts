const pad = (value: number) => String(value).padStart(2, '0');

export const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const compareDateKeys = (left: string, right: string) => {
  return left.localeCompare(right);
};

export const dateFromKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const getDateKeysInRange = (startDateKey: string, endDateKey = startDateKey) => {
  if (compareDateKeys(startDateKey, endDateKey) > 0) {
    throw new Error('End date must be on or after the start date');
  }

  const dateKeys: string[] = [];
  const cursor = dateFromKey(startDateKey);

  while (compareDateKeys(formatDateKey(cursor), endDateKey) <= 0) {
    dateKeys.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dateKeys;
};

export const combineDateKeyAndTime = (dateKey: string, time: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

export const formatTimeValue = (date: Date) => {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
