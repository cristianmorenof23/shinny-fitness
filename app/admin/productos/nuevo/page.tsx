import ProductForm from '@/app/components/admin/product-form'
import { prisma } from '@/app/lib/prisma'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo producto</h1>
        <p className="text-sm text-muted-foreground">
          Completá los datos para crear un producto.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}