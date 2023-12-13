export function show_if_there(text) {
    if (text === "" || text === null || text === undefined) {
        return "N/A";
    } else {
        return text;
    }
}