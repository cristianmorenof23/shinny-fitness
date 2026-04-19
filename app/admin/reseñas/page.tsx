import { requireAdmin } from '@/app/lib/auth'

export default async function ResenaPage() {
  await requireAdmin()

  return <div>ResenaPage</div>
}
