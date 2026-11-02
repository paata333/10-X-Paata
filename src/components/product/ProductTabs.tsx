import { useRef, useState, type KeyboardEvent } from 'react'
import type { Review, ReviewFormValues } from '../../types/product'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewList'

type TabId = 'description' | 'reviews'

interface ProductTabsProps {
  description: string
  reviews: Review[]
  onAddReview: (values: ReviewFormValues) => void
}

const TAB_ORDER: TabId[] = ['description', 'reviews']

export function ProductTabs({ description, reviews, onAddReview }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description')
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    description: null,
    reviews: null,
  })

  const labels: Record<TabId, string> = {
    description: 'Description',
    reviews: `Reviews (${reviews.length})`,
  }

  const selectTab = (tab: TabId) => {
    setActiveTab(tab)
    tabRefs.current[tab]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TAB_ORDER.indexOf(activeTab)
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectTab(TAB_ORDER[(index + 1) % TAB_ORDER.length])
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectTab(TAB_ORDER[(index - 1 + TAB_ORDER.length) % TAB_ORDER.length])
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectTab(TAB_ORDER[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      selectTab(TAB_ORDER[TAB_ORDER.length - 1])
    }
  }

  return (
    <section className="mt-12">
      <div role="tablist" aria-label="Product information" className="flex flex-wrap gap-2">
        {TAB_ORDER.map((tab) => (
          <button
            key={tab}
            ref={(element) => {
              tabRefs.current[tab] = element
            }}
            id={`tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={handleKeyDown}
            className={`min-h-11 rounded-lg border-2 border-neutral-950 px-4 py-2 text-base font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 motion-reduce:transition-none ${
              activeTab === tab
                ? 'bg-lime-300 shadow-[3px_3px_0_0_#0a0a0a]'
                : 'bg-white hover:bg-lime-100'
            }`}
          >
            {labels[tab]}
          </button>
        ))}
      </div>

      <div
        id="panel-description"
        role="tabpanel"
        aria-labelledby="tab-description"
        hidden={activeTab !== 'description'}
        className="mt-6"
      >
        <p className="max-w-3xl leading-relaxed text-neutral-800">{description}</p>
      </div>

      <div
        id="panel-reviews"
        role="tabpanel"
        aria-labelledby="tab-reviews"
        hidden={activeTab !== 'reviews'}
        className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]"
      >
        <ReviewList reviews={reviews} />
        <ReviewForm onSubmit={onAddReview} />
      </div>
    </section>
  )
}
