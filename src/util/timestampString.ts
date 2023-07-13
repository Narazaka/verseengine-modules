/**
 * "12:03"
 *
 * @param date date
 */
export function timestampString(date = new Date()) {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
