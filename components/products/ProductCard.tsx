import Image from 'next/image'
import Link from 'next/link'
import { ProductResponse } from '@/lib/api/types'
import { formatCurrency } from '@/lib/utils/format'

interface ProductCardProps {
  product: ProductResponse
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find(img => img.isMain) || product.images[0]
  const hasDiscount = product.discountPercent > 0
  const discountPrice = hasDiscount ? product.discountedPrice : product.sellPrice

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {mainImage ? (
            <Image
              src={mainImage.imageLink}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 text-sm">No image</div>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{product.discountPercent}%
            </div>
          )}

          {/* Rating Badge */}
          {product.averageRating > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <span>⭐</span>
              <span>{product.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Category & Company */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            {product.category && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {product.category.name}
              </span>
            )}
            {product.company && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {product.company.name}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(discountPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.sellPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${
              product.stockQuantity > 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {product.stockQuantity > 0 
                ? `In stock (${product.stockQuantity})` 
                : 'Out of stock'
              }
            </span>
            {product.soldQuantity > 0 && (
              <span className="text-xs text-gray-500">
                {product.soldQuantity} sold
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
