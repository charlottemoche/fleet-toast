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
    phone: '555-0101',
    name: 'Marcus Reyes',
    truckId: 'TX-114',
    shiftStart: shiftStartForRemaining(12),
    lastPing: minutesAgo(1),
    location: { lat: 32.7767, lng: -96.797, label: 'I-35 near Dallas, TX' },
    currentDelivery: {
      id: 'ord-4821',
      eta: minutesFromNow(18),
      loads: 2,
      isPerishable: false,
    },
    logs: [
      {
        timestamp: minutesAgo(35),
        message: 'Called re: traffic delay on I-35',
      },
      {
        timestamp: minutesAgo(10),
        message: 'Confirmed still on schedule despite congestion',
      },
    ],
  },
  {
    id: 'd2',
    phone: '555-0102',
    name: 'Priya Natarajan',
    truckId: 'GA-062',
    shiftStart: shiftStartForRemaining(0.01),
    lastPing: minutesAgo(2),
    location: { lat: 33.749, lng: -84.388, label: 'I-75 near Atlanta, GA' },
    currentDelivery: {
      id: 'ord-4830',
      eta: minutesFromNow(9),
      loads: 1,
      isPerishable: true,
    },
    logs: [
      {
        timestamp: minutesAgo(20),
        message: 'Reached out about tight ETA window',
      },
    ],
  },
  {
    id: 'd3',
    phone: '555-0103',
    name: 'Devon Whitfield',
    truckId: 'OH-233',
    shiftStart: shiftStartForRemaining(18),
    lastPing: minutesAgo(1),
    location: { lat: 39.9612, lng: -82.9988, label: 'I-70 near Columbus, OH' },
    currentDelivery: {
      id: 'ord-4844',
      eta: minutesFromNow(30),
      loads: 1,
      isPerishable: false,
    },
    logs: [],
  },

  // Approaching — under 2hr remaining
  {
    id: 'd4',
    phone: '555-0104',
    name: 'Sofia Alvarez',
    truckId: 'AZ-091',
    shiftStart: shiftStartForRemaining(90),
    lastPing: minutesAgo(1),
    location: { lat: 33.4484, lng: -112.074, label: 'I-10 near Phoenix, AZ' },
    currentDelivery: {
      id: 'ord-4852',
      eta: minutesFromNow(40),
      loads: 3,
      isPerishable: true,
    },
    logs: [],
  },
  {
    id: 'd5',
    phone: '555-0105',
    name: 'Jamal Carter',
    truckId: 'IL-177',
    shiftStart: shiftStartForRemaining(110),
    lastPing: minutesAgo(3),
    location: { lat: 41.8781, lng: -87.6298, label: 'I-90 near Chicago, IL' },
    currentDelivery: {
      id: 'ord-4860',
      eta: minutesFromNow(55),
      loads: 2,
      isPerishable: false,
    },
    logs: [],
  },
  {
    // Set to cross the 20 min critical threshold ~30s after load —
    // demonstrates the status is genuinely live, not a static label.
    id: 'd6',
    phone: '555-0106',
    name: 'Renata Silva',
    truckId: 'NC-045',
    shiftStart: shiftStartForRemaining(20.2),
    lastPing: minutesAgo(1),
    location: {
      lat: 35.2271,
      lng: -80.8431,
      label: 'I-85 near Charlotte, NC',
    },
    currentDelivery: {
      id: 'ord-4871',
      eta: minutesFromNow(15),
      loads: 1,
      isPerishable: true,
    },
    logs: [
      { timestamp: minutesAgo(5), message: 'Checked in — no issues reported' },
    ],
  },

  // On track
  {
    id: 'd7',
    phone: '555-0107',
    name: 'Owen Fitzgerald',
    truckId: 'CO-128',
    shiftStart: shiftStartForRemaining(600),
    lastPing: minutesAgo(1),
    location: { lat: 39.7392, lng: -104.9903, label: 'I-25 near Denver, CO' },
    currentDelivery: {
      id: 'ord-4880',
      eta: minutesFromNow(70),
      loads: 2,
      isPerishable: false,
    },
    logs: [],
  },
  {
    id: 'd8',
    phone: '555-0108',
    name: 'Bianca Odom',
    truckId: 'WA-019',
    shiftStart: shiftStartForRemaining(540),
    lastPing: minutesAgo(2),
    location: { lat: 47.6062, lng: -122.3321, label: 'I-5 near Seattle, WA' },
    currentDelivery: {
      id: 'ord-4891',
      eta: minutesFromNow(95),
      loads: 1,
      isPerishable: false,
    },
    logs: [],
  },
  {
    id: 'd9',
    phone: '555-0109',
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
    logs: [],
  },
  {
    id: 'd10',
    phone: '555-0110',
    name: 'Grace Lindqvist',
    truckId: 'MN-056',
    shiftStart: shiftStartForRemaining(480),
    lastPing: minutesAgo(3),
    location: {
      lat: 44.9778,
      lng: -93.265,
      label: 'I-94 near Minneapolis, MN',
    },
    currentDelivery: {
      id: 'ord-4902',
      eta: minutesFromNow(120),
      loads: 3,
      isPerishable: true,
    },
    logs: [],
  },
  {
    id: 'd11',
    phone: '555-0111',
    name: 'Tobias Okafor',
    truckId: 'TN-140',
    shiftStart: shiftStartForRemaining(615),
    lastPing: minutesAgo(1),
    location: { lat: 36.1627, lng: -86.7816, label: 'I-40 near Nashville, TN' },
    currentDelivery: {
      id: 'ord-4915',
      eta: minutesFromNow(50),
      loads: 2,
      isPerishable: false,
    },
    logs: [],
  },

  // Offline / stale — no ping in over 10 min. Offline overrides HOS status
  // even when the underlying timer would otherwise read critical or on track.
  {
    id: 'd12',
    phone: '555-0112',
    name: 'Wendell Marsh',
    truckId: 'PA-088',
    shiftStart: shiftStartForRemaining(420),
    lastPing: minutesAgo(25),
    location: {
      lat: 40.4406,
      lng: -79.9959,
      label: 'I-76 near Pittsburgh, PA',
    },
    currentDelivery: {
      id: 'ord-4923',
      eta: minutesFromNow(60),
      loads: 1,
      isPerishable: true,
    },
    logs: [
      {
        timestamp: minutesAgo(24),
        message: 'Attempted contact, no response — investigating',
      },
    ],
  },
  {
    id: 'd13',
    phone: '555-0113',
    name: 'Yuki Tanaka',
    truckId: 'OR-102',
    shiftStart: shiftStartForRemaining(15),
    lastPing: minutesAgo(45),
    location: {
      lat: 45.5152,
      lng: -122.6784,
      label: 'I-5 near Portland, OR',
    },
    currentDelivery: {
      id: 'ord-4931',
      eta: minutesFromNow(20),
      loads: 2,
      isPerishable: false,
    },
    logs: [],
  },
  {
    id: 'd14',
    phone: '555-0114',
    name: 'Camille Fontaine',
    truckId: 'MO-064',
    shiftStart: shiftStartForRemaining(300),
    lastPing: minutesAgo(15),
    location: { lat: 38.627, lng: -90.1994, label: 'I-70 near St. Louis, MO' },
    currentDelivery: {
      id: 'ord-4948',
      eta: minutesFromNow(75),
      loads: 1,
      isPerishable: false,
    },
    logs: [],
  },
]
