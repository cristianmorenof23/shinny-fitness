import { requireAdmin } from '@/app/lib/auth'

export default async function NuevaResenaPage() {
  await requireAdmin()

  return <div>NuevaResenaPage</div>
}
