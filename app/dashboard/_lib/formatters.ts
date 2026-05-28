export const dateTimeFormatter = {
  date: (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    }),
  time: (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  price: (amount: number) => `$${amount.toLocaleString("en-US")}`,
}


