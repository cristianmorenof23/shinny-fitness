import { requireAdmin } from '@/app/lib/auth'

export default async function PedidosSlugPage() {
  await requireAdmin()

  return <div>PedidosSlugPage</div>
}
