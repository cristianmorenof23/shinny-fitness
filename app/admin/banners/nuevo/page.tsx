import { requireAdmin } from '@/app/lib/auth'

export default async function NuevoBannerPage() {
  await requireAdmin()

  return <div>NuevoBannerPage</div>
}
