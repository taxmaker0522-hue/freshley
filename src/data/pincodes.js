// Real serviceable areas (Hyderabad), added 2 Oct 2026. One row per area;
// several areas share a pincode, which is normal for Indian postal codes.
// `servicePincodes` (used by DeliveryCheck and the profile pincode check) is
// derived from this list, so area names stay available if ever needed for
// display without duplicating the pincode data.
export const serviceAreas = [
  { area: 'Gachibowli', pincode: '500032' },
  { area: 'Financial District', pincode: '500032' },
  { area: 'Nanakramguda', pincode: '500032' },
  { area: 'Kokapet', pincode: '500075' },
  { area: 'Narsingi', pincode: '500075' },
  { area: 'Manikonda', pincode: '500089' },
  { area: 'Puppalaguda', pincode: '500089' },
  { area: 'Khajaguda', pincode: '500089' },
  { area: 'Raidurg', pincode: '500008' },
  { area: 'Madhapur', pincode: '500081' },
  { area: 'Kondapur', pincode: '500084' },
  { area: 'Hitech City', pincode: '500081' },
  { area: 'Jubilee Hills', pincode: '500033' },
  { area: 'Banjara Hills', pincode: '500034' },
  { area: 'Miyapur', pincode: '500049' },
  { area: 'Hafeezpet', pincode: '500049' },
  { area: 'Chandanagar', pincode: '500050' },
  { area: 'Lingampally', pincode: '500019' },
  { area: 'Kukatpally', pincode: '500072' },
  { area: 'Bachupally', pincode: '500090' },
  { area: 'Kompally', pincode: '500014' },
  { area: 'Medchal', pincode: '501401' },
  { area: 'Shamshabad', pincode: '501218' },
  { area: 'Rajendranagar', pincode: '500030' },
  { area: 'Budvel', pincode: '500030' },
  { area: 'Attapur', pincode: '500048' },
  { area: 'Tukkuguda', pincode: '501359' },
  { area: 'Adibatla', pincode: '501510' },
  { area: 'Pedda Amberpet', pincode: '501505' },
  { area: 'Uppal', pincode: '500039' },
  { area: 'Nagole', pincode: '500068' },
]

export const servicePincodes = [...new Set(serviceAreas.map((a) => a.pincode))]
