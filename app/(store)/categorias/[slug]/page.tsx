import type { Metadata } from 'next'
import { prisma } from '@/app/lib/prisma'
import { createMetadata, truncateDescription } from '@/app/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    })

    if (!category) {
      return createMetadata({
        title: 'Categoria no encontrada',
        description:
          'No encontramos la categoria que intentaste visitar en Shiny Fitness.',
        path: `/categorias/${slug}`,
        noIndex: true,
      })
    }

    return createMetadata({
      title: category.name,
      description: truncateDescription(
        category.description ??
          `Explora la categoria ${category.name} en Shiny Fitness.`
      ),
      path: `/categorias/${category.slug}`,
      image: category.imageUrl ?? undefined,
      keywords: [category.name, 'categoria', 'ropa deportiva femenina'],
    })
  } catch {
    return createMetadata({
      title: 'Categoria',
      description:
        'Explora esta categoria de Shiny Fitness y descubre ropa deportiva femenina para tu estilo.',
      path: `/categorias/${slug}`,
      noIndex: true,
    })
  }
}

export default function CategoriaSlugPage() {
  return <div>CategoriaSlugPage</div>
}
