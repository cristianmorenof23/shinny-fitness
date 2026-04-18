import { prisma } from '@/app/lib/prisma'
import ProductsTable from '../components/admin/products-table'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-500">
            Gestioná el catálogo de la tienda
          </p>
        </div>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}