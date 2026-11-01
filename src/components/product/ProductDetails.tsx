import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import type { AddItemResult } from '../../types/cart'
import type { Product } from '../../types/product'
import { discountedPrice, formatCategory, formatPrice } from '../../utils/format'
import { Button } from '../ui/Button'
import { QuantityStepper } from '../ui/QuantityStepper'
import { StockBadge } from './StockBadge'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState<AddItemResult | null>(null)

  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const hasDiscount = product.discountPercentage >= 1
  const finalPrice = discountedPrice(product.price, product.discountPercentage)
  const isOutOfStock = product.stock === 0
  const categoryLine = product.brand
    ? `${product.brand} · ${formatCategory(product.category)}`
    : formatCategory(product.category)

  const handleAdd = () => {
    setFeedback(addItem(product, quantity))
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <div className="overflow-hidden rounded-2xl border-2 border-neutral-950 bg-lime-200 shadow-[6px_6px_0_0_#0a0a0a]">
          <img
            src={images[selectedIndex]}
            alt={product.title}
            width={600}
            height={600}
            className="aspect-square w-full object-contain p-6"
          />
        </div>
        {images.length > 1 && (
          <ul className="mt-5 flex flex-wrap gap-3">
            {images.map((image, index) => (
              <li key={image}>
                <button
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === selectedIndex}
                  onClick={() => setSelectedIndex(index)}
                  className={`size-16 overflow-hidden rounded-lg border-2 border-neutral-950 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 motion-reduce:transition-none ${
                    index === selectedIndex
                      ? 'bg-lime-300 shadow-[3px_3px_0_0_#0a0a0a]'
                      : 'bg-white opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt="" width={64} height={64} className="size-full object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {categoryLine}
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {product.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span data-display className="text-4xl font-extrabold">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <>
              <s className="text-lg font-medium text-neutral-500">{formatPrice(product.price)}</s>
              <span className="-rotate-3 rounded-md border-2 border-neutral-950 bg-green-300 px-2 py-0.5 text-sm font-extrabold">
                −{Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold">★ {product.rating.toFixed(1)}</span>
          <StockBadge stock={product.stock} />
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Description
          </h2>
          <p className="mt-2 leading-relaxed text-neutral-800">{product.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t-2 border-dashed border-neutral-950/30 pt-5">
          <QuantityStepper
            value={quantity}
            max={product.stock}
            disabled={isOutOfStock}
            onChange={setQuantity}
          />
          <Button onClick={handleAdd} disabled={isOutOfStock}>
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
        </div>

        {feedback && (
          <p
            role="status"
            className={`flex flex-wrap items-center gap-x-3 rounded-lg border-2 border-neutral-950 px-3 py-2 text-sm font-semibold ${
              feedback.added ? 'bg-green-200' : 'bg-orange-200'
            }`}
          >
            <span>{feedback.message}</span>
            {feedback.added && (
              <Link to="/cart" className="font-bold underline decoration-2 underline-offset-4">
                View cart →
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
