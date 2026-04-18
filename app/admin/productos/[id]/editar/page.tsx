import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import ProductForm from '@/app/components/admin/product-form'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  })

  if (!product) notFound()

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar producto</h1>
        <p className="text-sm text-muted-foreground">
          Modificá la información del producto.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}