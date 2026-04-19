import { requireAdmin } from '@/app/lib/auth'

export default async function BannearEditarPage() {
  await requireAdmin()

  return <div>BannearEditarPage</div>
}
