export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string; // IANA
  gmt: string; // display offset, standard time
};

// Mock dataset — real coordinates. Backend will replace this (see src/services/cities.ts).
export const CITIES: City[] = [
  // Indonesia — WIB (GMT+7)
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bandung', name: 'Bandung', country: 'Indonesia', lat: -6.9175, lng: 107.6191, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'surabaya', name: 'Surabaya', country: 'Indonesia', lat: -7.2575, lng: 112.7521, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'yogyakarta', name: 'Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3695, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'semarang', name: 'Semarang', country: 'Indonesia', lat: -6.9667, lng: 110.4167, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'medan', name: 'Medan', country: 'Indonesia', lat: 3.5952, lng: 98.6722, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'palembang', name: 'Palembang', country: 'Indonesia', lat: -2.9761, lng: 104.7754, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bandar-lampung', name: 'Bandar Lampung', country: 'Indonesia', lat: -5.45, lng: 105.2667, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'padang', name: 'Padang', country: 'Indonesia', lat: -0.9471, lng: 100.4172, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'pekanbaru', name: 'Pekanbaru', country: 'Indonesia', lat: 0.5071, lng: 101.4478, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'batam', name: 'Batam', country: 'Indonesia', lat: 1.1301, lng: 104.0529, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bogor', name: 'Bogor', country: 'Indonesia', lat: -6.5971, lng: 106.806, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'depok', name: 'Depok', country: 'Indonesia', lat: -6.4025, lng: 106.7942, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'bekasi', name: 'Bekasi', country: 'Indonesia', lat: -6.2383, lng: 106.9756, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'tangerang', name: 'Tangerang', country: 'Indonesia', lat: -6.1783, lng: 106.6319, timezone: 'Asia/Jakarta', gmt: 'GMT+7' },
  { id: 'pontianak', name: 'Pontianak', country: 'Indonesia', lat: -0.0263, lng: 109.3425, timezone: 'Asia/Pontianak', gmt: 'GMT+7' },
  // Indonesia — WITA (GMT+8) / WIT (GMT+9)
  { id: 'balikpapan', name: 'Balikpapan', country: 'Indonesia', lat: -1.2379, lng: 116.8529, timezone: 'Asia/Makassar', gmt: 'GMT+8' },
  { id: 'denpasar', name: 'Denpasar (Bali)', country: 'Indonesia', lat: -8.6705, lng: 115.2126, timezone: 'Asia/Makassar', gmt: 'GMT+8' },
  { id: 'makassar', name: 'Makassar', country: 'Indonesia', lat: -5.1477, lng: 119.4327, timezone: 'Asia/Makassar', gmt: 'GMT+8' },
  { id: 'jayapura', name: 'Jayapura', country: 'Indonesia', lat: -2.5916, lng: 140.669, timezone: 'Asia/Jayapura', gmt: 'GMT+9' },
  { id: 'ambon', name: 'Ambon', country: 'Indonesia', lat: -3.6954, lng: 128.1814, timezone: 'Asia/Jayapura', gmt: 'GMT+9' },
  // Southeast Asia
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', gmt: 'GMT+8' },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', gmt: 'GMT+8' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok', gmt: 'GMT+7' },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, timezone: 'Asia/Ho_Chi_Minh', gmt: 'GMT+7' },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, timezone: 'Asia/Ho_Chi_Minh', gmt: 'GMT+7' },
  { id: 'manila', name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, timezone: 'Asia/Manila', gmt: 'GMT+8' },
  { id: 'phnom-penh', name: 'Phnom Penh', country: 'Cambodia', lat: 11.5564, lng: 104.9282, timezone: 'Asia/Phnom_Penh', gmt: 'GMT+7' },
  { id: 'vientiane', name: 'Vientiane', country: 'Laos', lat: 17.9757, lng: 102.6331, timezone: 'Asia/Vientiane', gmt: 'GMT+7' },
  // East Asia
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo', gmt: 'GMT+9' },
  { id: 'osaka', name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, timezone: 'Asia/Tokyo', gmt: 'GMT+9' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978, timezone: 'Asia/Seoul', gmt: 'GMT+9' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, timezone: 'Asia/Hong_Kong', gmt: 'GMT+8' },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654, timezone: 'Asia/Taipei', gmt: 'GMT+8' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, timezone: 'Asia/Shanghai', gmt: 'GMT+8' },
  { id: 'beijing', name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, timezone: 'Asia/Shanghai', gmt: 'GMT+8' },
  // South Asia
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata', gmt: 'GMT+5:30' },
  { id: 'delhi', name: 'New Delhi', country: 'India', lat: 28.7041, lng: 77.1025, timezone: 'Asia/Kolkata', gmt: 'GMT+5:30' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka', gmt: 'GMT+6' },
  { id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.324, timezone: 'Asia/Kathmandu', gmt: 'GMT+5:45' },
  // Middle East
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', gmt: 'GMT+4' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, timezone: 'Asia/Riyadh', gmt: 'GMT+3' },
  { id: 'doha', name: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531, timezone: 'Asia/Qatar', gmt: 'GMT+3' },
  { id: 'istanbul', name: 'Istanbul', country: 'Türkiye', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', gmt: 'GMT+3' },
  // Europe
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', gmt: 'GMT+0' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris', gmt: 'GMT+1' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, timezone: 'Europe/Berlin', gmt: 'GMT+1' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, timezone: 'Europe/Amsterdam', gmt: 'GMT+1' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, timezone: 'Europe/Madrid', gmt: 'GMT+1' },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, timezone: 'Europe/Rome', gmt: 'GMT+1' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, timezone: 'Europe/Zurich', gmt: 'GMT+1' },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, timezone: 'Europe/Stockholm', gmt: 'GMT+1' },
  { id: 'oslo', name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, timezone: 'Europe/Oslo', gmt: 'GMT+1' },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, timezone: 'Europe/Copenhagen', gmt: 'GMT+1' },
  { id: 'helsinki', name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, timezone: 'Europe/Helsinki', gmt: 'GMT+2' },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, timezone: 'Europe/Dublin', gmt: 'GMT+0' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, timezone: 'Europe/Lisbon', gmt: 'GMT+0' },
  { id: 'prague', name: 'Prague', country: 'Czechia', lat: 50.0755, lng: 14.4378, timezone: 'Europe/Prague', gmt: 'GMT+1' },
  { id: 'vienna', name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, timezone: 'Europe/Vienna', gmt: 'GMT+1' },
  { id: 'athens', name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, timezone: 'Europe/Athens', gmt: 'GMT+2' },
  { id: 'moscow', name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow', gmt: 'GMT+3' },
  // North America
  { id: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, timezone: 'America/New_York', gmt: 'GMT-5' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles', gmt: 'GMT-8' },
  { id: 'san-francisco', name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles', gmt: 'GMT-8' },
  { id: 'chicago', name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago', gmt: 'GMT-6' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', gmt: 'GMT-5' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver', gmt: 'GMT-8' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, timezone: 'America/Mexico_City', gmt: 'GMT-6' },
  { id: 'honolulu', name: 'Honolulu', country: 'USA', lat: 21.3069, lng: -157.8583, timezone: 'Pacific/Honolulu', gmt: 'GMT-10' },
  // South America
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo', gmt: 'GMT-3' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, timezone: 'America/Argentina/Buenos_Aires', gmt: 'GMT-3' },
  { id: 'lima', name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, timezone: 'America/Lima', gmt: 'GMT-5' },
  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', gmt: 'GMT+10' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne', gmt: 'GMT+10' },
  { id: 'perth', name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, timezone: 'Australia/Perth', gmt: 'GMT+8' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland', gmt: 'GMT+12' },
  { id: 'wellington', name: 'Wellington', country: 'New Zealand', lat: -41.2865, lng: 174.7762, timezone: 'Pacific/Auckland', gmt: 'GMT+12' },
  // Africa
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo', gmt: 'GMT+2' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos', gmt: 'GMT+1' },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, timezone: 'Africa/Johannesburg', gmt: 'GMT+2' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi', gmt: 'GMT+3' },
];
