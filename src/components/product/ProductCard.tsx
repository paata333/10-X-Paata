import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AddItemResult } from '../../types/cart'
import type { Product } from '../../types/product'
import { discountedPrice, formatCategory, formatPrice } from '../../utils/format'
import { Button } from '../ui/Button'
import { StockBadge } from './StockBadge'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => AddItemResult
}

const tileColors = [
  'bg-lime-200',
  'bg-orange-200',
  'bg-sky-200',
  'bg-pink-200',
  'bg-yellow-200',
  'bg-violet-200',
]

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [feedback, setFeedback] = useState<AddItemResult | null>(null)
  const hasDiscount = product.discountPercentage >= 1
  const finalPrice = discountedPrice(product.price, product.discountPercentage)
  const tileColor = tileColors[product.id % tileColors.length]
  const categoryLine = product.brand
    ? `${formatCategory(product.category)} · ${product.brand}`
    : formatCategory(product.category)

  useEffect(() => {
    if (feedback === null) {
      return
    }
    const timer = window.setTimeout(() => setFeedback(null), 3000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const isOutOfStock = product.stock === 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-neutral-950 bg-white shadow-[4px_4px_0_0_#0a0a0a] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#0a0a0a] motion-reduce:transition-none">
      <div className={`relative border-b-2 border-neutral-950 ${tileColor}`}>
        <img
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={300}
          loading="lazy"
          className="aspect-square w-full object-contain p-5 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 -rotate-6 rounded-md border-2 border-neutral-950 bg-green-300 px-2 py-0.5 text-sm font-extrabold">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-md bg-neutral-950 px-1.5 py-0.5 font-mono text-[11px] font-bold text-lime-300">
          No. {String(product.id).padStart(3, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {categoryLine}
        </p>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight">
          <Link
            to={`/products/${product.id}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          >
            {product.title}
          </Link>
        </h3>
        <div className="flex items-baseline gap-2">
          <span data-display className="text-2xl font-extrabold">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <s className="text-sm font-medium text-neutral-500">{formatPrice(product.price)}</s>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-sm">
          <span className="font-bold">★ {product.rating.toFixed(1)}</span>
          <StockBadge stock={product.stock} />
        </div>
        <Button
          size="sm"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => setFeedback(onAdd(product))}
          className="relative z-10 mt-1"
        >
          {isOutOfStock ? 'Out of stock' : 'Add to cart'}
        </Button>
        {feedback && (
          <p
            role="status"
            className={`relative z-10 rounded-md border-2 border-neutral-950 px-2 py-1 text-xs font-semibold ${
              feedback.added ? 'bg-green-200' : 'bg-orange-200'
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </article>
  )
}
