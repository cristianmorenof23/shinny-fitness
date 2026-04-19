import { requireAdmin } from '@/app/lib/auth'

export default async function BannerPage() {
  await requireAdmin()

  return <div>BannerPage</div>
}
