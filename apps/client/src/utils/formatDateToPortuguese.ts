export function formatDateToPortuguese(dateString: string): string | undefined {
  // Check if the input is a valid ISO date string
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(dateString)) {
    return undefined; // Invalid format
  }

  const date = new Date(dateString);
  const options = {
    weekday: "long" as const, // Cast weekday to the expected type
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
  };

  const formattedDate = date.toLocaleDateString("pt-BR", options);

  // Extract day and time from the formatted string
  const day = formattedDate.split(",")[0]; // Assuming day is the first part before comma

  return `${day}`; // Return day and formatted time
}
