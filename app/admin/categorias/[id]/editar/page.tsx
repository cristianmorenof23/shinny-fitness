import { requireAdmin } from '@/app/lib/auth'

export default async function CategoriasIdPage() {
  await requireAdmin()

  return <div>CategoriasIdPage</div>
}
