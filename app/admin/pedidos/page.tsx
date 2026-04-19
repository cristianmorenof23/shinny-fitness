import { requireAdmin } from '@/app/lib/auth'

export default async function PedidosPage() {
  await requireAdmin()

  return <div>PedidosPage</div>
}
