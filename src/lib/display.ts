export function displayInitial(name?: string | null) {
  const value = name?.trim();
  return value ? Array.from(value)[0].toUpperCase() : '?';
}
