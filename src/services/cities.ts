import { CITIES, type City } from '@/src/data/cities.mock';

export type { City };

// Backend swap point: replace implementation with
//   fetch(`${API_URL}/cities?q=${encodeURIComponent(query)}`)
// keeping this exact signature.
export async function searchCities(query: string): Promise<City[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, 8);
}
