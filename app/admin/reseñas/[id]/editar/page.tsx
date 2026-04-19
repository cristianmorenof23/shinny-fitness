import { requireAdmin } from '@/app/lib/auth'

export default async function EditarResenaPage() {
  await requireAdmin()

  return <div>EditarResenaPage</div>
}
