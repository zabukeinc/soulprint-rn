import { CITIES, type City } from '@/src/data/cities.mock';
import { searchBackendCities } from '@/src/services/backend';

export type { City };

export async function searchCities(query: string): Promise<City[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  try {
    const response = await searchBackendCities(query);
    const results = response.data;
    if (results.length > 0) return results;
  } catch {
    // Keep onboarding usable when the local backend is not reachable.
  }

  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, 8);
}
