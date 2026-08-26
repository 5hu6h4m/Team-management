export function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(`ecell_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(`ecell_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}
