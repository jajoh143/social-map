// Chicago center: 41.8781, -87.6298

export const CHICAGO_CENTER = [41.8781, -87.6298];

export const mockUsers = [
  {
    id: 1,
    name: "Alex Rivera",
    age: 28,
    bio: "Coffee enthusiast & urban explorer",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=alex",
    lat: 41.8827,
    lng: -87.6233,
    neighborhood: "River North",
    interests: ["Coffee", "Photography", "Cycling"],
    online: true,
  },
  {
    id: 2,
    name: "Jordan Lee",
    age: 31,
    bio: "Foodie, dog mom, weekend hiker",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=jordan",
    lat: 41.8756,
    lng: -87.6189,
    neighborhood: "The Loop",
    interests: ["Food", "Hiking", "Dogs"],
    online: true,
  },
  {
    id: 3,
    name: "Sam Chen",
    age: 25,
    bio: "Tech & jazz lover",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=sam",
    lat: 41.8902,
    lng: -87.6346,
    neighborhood: "Gold Coast",
    interests: ["Jazz", "Tech", "Art"],
    online: false,
  },
  {
    id: 4,
    name: "Morgan Davis",
    age: 34,
    bio: "Architect by day, chef by night",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=morgan",
    lat: 41.8654,
    lng: -87.6470,
    neighborhood: "Pilsen",
    interests: ["Cooking", "Architecture", "Music"],
    online: true,
  },
  {
    id: 5,
    name: "Taylor Kim",
    age: 27,
    bio: "Marathon runner & book club host",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=taylor",
    lat: 41.8974,
    lng: -87.6276,
    neighborhood: "Lincoln Park",
    interests: ["Running", "Books", "Yoga"],
    online: false,
  },
  {
    id: 6,
    name: "Casey Torres",
    age: 30,
    bio: "Artist & vintage vinyl collector",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=casey",
    lat: 41.9087,
    lng: -87.6765,
    neighborhood: "Wicker Park",
    interests: ["Art", "Music", "Vinyl"],
    online: true,
  },
  {
    id: 7,
    name: "Riley Park",
    age: 26,
    bio: "Startup founder, yoga teacher",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=riley",
    lat: 41.8543,
    lng: -87.6326,
    neighborhood: "Bridgeport",
    interests: ["Yoga", "Startups", "Travel"],
    online: true,
  },
  {
    id: 8,
    name: "Drew Walsh",
    age: 33,
    bio: "Bears fan & brewery hopper",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=drew",
    lat: 41.9214,
    lng: -87.6531,
    neighborhood: "Logan Square",
    interests: ["Sports", "Beer", "Comedy"],
    online: false,
  },
];

export const mockEvents = [
  {
    id: 1,
    title: "Chicago Jazz Night",
    description: "Live jazz at Millennium Park. Bring a blanket!",
    lat: 41.8827,
    lng: -87.6233,
    date: "2026-03-20",
    time: "7:00 PM",
    organizer: "Alex Rivera",
    category: "Music",
    attendees: 34,
    neighborhood: "River North",
  },
  {
    id: 2,
    title: "Wicker Park Art Walk",
    description: "Monthly gallery hop through the neighborhood",
    lat: 41.9087,
    lng: -87.6765,
    date: "2026-03-22",
    time: "2:00 PM",
    organizer: "Casey Torres",
    category: "Art",
    attendees: 18,
    neighborhood: "Wicker Park",
  },
  {
    id: 3,
    title: "Lakefront 5K",
    description: "Casual morning run along the lakefront path",
    lat: 41.8974,
    lng: -87.6155,
    date: "2026-03-21",
    time: "8:00 AM",
    organizer: "Taylor Kim",
    category: "Sports",
    attendees: 52,
    neighborhood: "Lincoln Park",
  },
  {
    id: 4,
    title: "Pilsen Food Tour",
    description: "Explore the best taquerias and bakeries in Pilsen",
    lat: 41.8654,
    lng: -87.6470,
    date: "2026-03-23",
    time: "12:00 PM",
    organizer: "Morgan Davis",
    category: "Food",
    attendees: 20,
    neighborhood: "Pilsen",
  },
];

export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
