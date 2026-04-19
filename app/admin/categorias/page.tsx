import { requireAdmin } from '@/app/lib/auth'

export default async function CategoriasPage() {
  await requireAdmin()

  return <div>CategoriasPage</div>
}
