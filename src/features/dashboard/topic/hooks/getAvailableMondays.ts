export function getAvailableMondays(): string[] {
    const result: string[] = [];

    const minDate = new Date("2026-06-01");

    const today = new Date();

    const currentMonday = new Date(today);

    currentMonday.setDate(
        today.getDate() - ((today.getDay() + 6) % 7)
    );

    while (currentMonday >= minDate) {
        result.push(
            currentMonday.toISOString().split("T")[0]
        );

        currentMonday.setDate(
            currentMonday.getDate() - 7
        );
    }

    return result;
}