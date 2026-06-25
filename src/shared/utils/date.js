/** Small date helpers (kept dependency-free). */
export const nowSeconds = () => Math.floor(Date.now() / 1000);

export const addSeconds = (date, seconds) => new Date(date.getTime() + seconds * 1000);
export const addMinutes = (date, minutes) => addSeconds(date, minutes * 60);
export const addHours = (date, hours) => addMinutes(date, hours * 60);
export const addDays = (date, days) => addHours(date, days * 24);

export const isExpired = (date) => {
  const time = date instanceof Date ? date.getTime() : new Date(date).getTime();
  return Number.isNaN(time) || time < Date.now();
};
