export function getDayAndMonth(dateStr: string) {
  const date = new Date(dateStr);

  const day = date.getDate().toString().padStart(2, "0");

  const monthsEs = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  const month = monthsEs[date.getMonth()];

  return {
    day,
    month,
  };
}
