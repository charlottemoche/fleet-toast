export const trucks = [
  { id: 'TX-114', make: 'Freightliner', model: 'Cascadia', year: 2022 },
  { id: 'GA-062', make: 'Peterbilt', model: '579', year: 2021 },
  { id: 'OH-233', make: 'Kenworth', model: 'T680', year: 2023 },
  { id: 'AZ-091', make: 'Volvo', model: 'VNL', year: 2020 },
  { id: 'IL-177', make: 'International', model: 'LT', year: 2022 },
  { id: 'NC-045', make: 'Mack', model: 'Anthem', year: 2021 },
  { id: 'CO-128', make: 'Freightliner', model: 'Cascadia', year: 2019 },
  { id: 'WA-019', make: 'Peterbilt', model: '389', year: 2020 },
  { id: 'NV-073', make: 'Kenworth', model: 'T880', year: 2022 },
  { id: 'MN-056', make: 'Volvo', model: 'VNR', year: 2023 },
  { id: 'TN-140', make: 'Western Star', model: '5700XE', year: 2021 },
  { id: 'PA-088', make: 'International', model: 'RH', year: 2020 },
  { id: 'OR-102', make: 'Mack', model: 'Pinnacle', year: 2019 },
  { id: 'MO-064', make: 'Freightliner', model: 'Cascadia', year: 2023 },
]

export function getTruckById(truckId) {
  return trucks.find((truck) => truck.id === truckId)
}
