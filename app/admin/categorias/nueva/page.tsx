import { requireAdmin } from '@/app/lib/auth'

export default async function NuevaCategoriaPage() {
  await requireAdmin()

  return <div>NuevaCategoriaPage</div>
}
