const HOS_LIMIT_MINUTES = 11 * 60

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60_000).toISOString()
}

function shiftStartForRemaining(remainingMinutes) {
  return minutesAgo(HOS_LIMIT_MINUTES - remainingMinutes)
}

export const mockDrivers = [
  // Critical — under 20 min remaining
  {
    id: 'd1',
    name: 'Marcus Reyes',
    truckId: 'TX-114',
    shiftStart: shiftStartForRemaining(12),
    lastPing: minutesAgo(1),
    location: { lat: 32.7767, lng: -96.797, label: 'I-35 near Dallas, TX' },
    currentDelivery: { id: 'ord-4821', eta: minutesFromNow(18) },
  },
  {
    id: 'd2',
    name: 'Priya Natarajan',
    truckId: 'GA-062',
    shiftStart: shiftStartForRemaining(5),
    lastPing: minutesAgo(2),
    location: { lat: 33.749, lng: -84.388, label: 'I-75 near Atlanta, GA' },
    currentDelivery: { id: 'ord-4830', eta: minutesFromNow(9) },
  },
  {
    id: 'd3',
    name: 'Devon Whitfield',
    truckId: 'OH-233',
    shiftStart: shiftStartForRemaining(18),
    lastPing: minutesAgo(1),
    location: { lat: 39.9612, lng: -82.9988, label: 'I-70 near Columbus, OH' },
    currentDelivery: { id: 'ord-4844', eta: minutesFromNow(30) },
  },

  // Approaching — under 2hr remaining
  {
    id: 'd4',
    name: 'Sofia Alvarez',
    truckId: 'AZ-091',
    shiftStart: shiftStartForRemaining(90),
    lastPing: minutesAgo(1),
    location: { lat: 33.4484, lng: -112.074, label: 'I-10 near Phoenix, AZ' },
    currentDelivery: { id: 'ord-4852', eta: minutesFromNow(40) },
  },
  {
    id: 'd5',
    name: 'Jamal Carter',
    truckId: 'IL-177',
    shiftStart: shiftStartForRemaining(110),
    lastPing: minutesAgo(3),
    location: { lat: 41.8781, lng: -87.6298, label: 'I-90 near Chicago, IL' },
    currentDelivery: { id: 'ord-4860', eta: minutesFromNow(55) },
  },
  {
    // Set to cross the 20 min critical threshold about a minute after load —
    // demonstrates the status is genuinely live, not a static label.
    id: 'd6',
    name: 'Renata Silva',
    truckId: 'NC-045',
    shiftStart: shiftStartForRemaining(20.5),
    lastPing: minutesAgo(1),
    location: {
      lat: 35.2271,
      lng: -80.8431,
      label: 'I-85 near Charlotte, NC',
    },
    currentDelivery: { id: 'ord-4871', eta: minutesFromNow(15) },
  },

  // On track
  {
    id: 'd7',
    name: 'Owen Fitzgerald',
    truckId: 'CO-128',
    shiftStart: shiftStartForRemaining(600),
    lastPing: minutesAgo(1),
    location: { lat: 39.7392, lng: -104.9903, label: 'I-25 near Denver, CO' },
    currentDelivery: { id: 'ord-4880', eta: minutesFromNow(70) },
  },
  {
    id: 'd8',
    name: 'Bianca Odom',
    truckId: 'WA-019',
    shiftStart: shiftStartForRemaining(540),
    lastPing: minutesAgo(2),
    location: { lat: 47.6062, lng: -122.3321, label: 'I-5 near Seattle, WA' },
    currentDelivery: { id: 'ord-4891', eta: minutesFromNow(95) },
  },
  {
    id: 'd9',
    name: 'Hector Delgado',
    truckId: 'NV-073',
    shiftStart: shiftStartForRemaining(630),
    lastPing: minutesAgo(1),
    location: {
      lat: 36.1699,
      lng: -115.1398,
      label: 'I-15 near Las Vegas, NV',
    },
    // Between deliveries — exercises the empty-delivery state in the UI.
    currentDelivery: null,
  },
  {
    id: 'd10',
    name: 'Grace Lindqvist',
    truckId: 'MN-056',
    shiftStart: shiftStartForRemaining(480),
    lastPing: minutesAgo(3),
    location: {
      lat: 44.9778,
      lng: -93.265,
      label: 'I-94 near Minneapolis, MN',
    },
    currentDelivery: { id: 'ord-4902', eta: minutesFromNow(120) },
  },
  {
    id: 'd11',
    name: 'Tobias Okafor',
    truckId: 'TN-140',
    shiftStart: shiftStartForRemaining(615),
    lastPing: minutesAgo(1),
    location: { lat: 36.1627, lng: -86.7816, label: 'I-40 near Nashville, TN' },
    currentDelivery: { id: 'ord-4915', eta: minutesFromNow(50) },
  },

  // Offline / stale — no ping in over 10 min. Offline overrides HOS status
  // even when the underlying timer would otherwise read critical or on track.
  {
    id: 'd12',
    name: 'Wendell Marsh',
    truckId: 'PA-088',
    shiftStart: shiftStartForRemaining(420),
    lastPing: minutesAgo(25),
    location: {
      lat: 40.4406,
      lng: -79.9959,
      label: 'I-76 near Pittsburgh, PA',
    },
    currentDelivery: { id: 'ord-4923', eta: minutesFromNow(60) },
  },
  {
    id: 'd13',
    name: 'Yuki Tanaka',
    truckId: 'OR-102',
    shiftStart: shiftStartForRemaining(15),
    lastPing: minutesAgo(45),
    location: {
      lat: 45.5152,
      lng: -122.6784,
      label: 'I-5 near Portland, OR',
    },
    currentDelivery: { id: 'ord-4931', eta: minutesFromNow(20) },
  },
  {
    id: 'd14',
    name: 'Camille Fontaine',
    truckId: 'MO-064',
    shiftStart: shiftStartForRemaining(300),
    lastPing: minutesAgo(15),
    location: { lat: 38.627, lng: -90.1994, label: 'I-70 near St. Louis, MO' },
    currentDelivery: { id: 'ord-4948', eta: minutesFromNow(75) },
  },
]
