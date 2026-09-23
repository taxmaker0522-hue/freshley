// Weekly basket statuses, in the order they happen. Keys match the `status`
// check in supabase/schema.sql.
export const ORDER_STATUS = {
  scheduled: { label: 'Scheduled', className: 'bg-lime/25 text-leaf' },
  packed: { label: 'Packed', className: 'bg-leaf/15 text-leaf' },
  delivered: { label: 'Delivered', className: 'bg-leaf text-cream' },
  skipped: { label: 'Skipped', className: 'bg-soil/10 text-secondary' },
}
