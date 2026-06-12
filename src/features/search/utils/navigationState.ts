export const searchPageStateStorageKey = "scipub.searchPageState";

const searchPageRestorePendingKey = "scipub.searchPageRestorePending";

export function markSearchPageRestorePending() {
  try {
    window.sessionStorage.setItem(searchPageRestorePendingKey, "1");
  } catch {
    // Ignore storage failures so navigation still works normally.
  }
}

export function readSearchPageRestorePending() {
  try {
    return window.sessionStorage.getItem(searchPageRestorePendingKey) === "1";
  } catch {
    return false;
  }
}

export function clearSearchPageRestorePending() {
  try {
    window.sessionStorage.removeItem(searchPageRestorePendingKey);
  } catch {
    // Ignore storage failures so navigation still works normally.
  }
}
