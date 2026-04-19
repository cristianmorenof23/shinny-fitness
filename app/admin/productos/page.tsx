import { requireAdmin } from '@/app/lib/auth'

export default async function ProductosPage() {
  await requireAdmin()

  return <div>ProductosPage</div>
}
