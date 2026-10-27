import { useParams } from 'react-router-dom'
import { Page } from '../components/ui/Page'

export function ProductPage() {
  const { id } = useParams()

  return (
    <Page title={`Product #${id ?? ''}`}>
      <p className="text-stone-600">Product details will appear here.</p>
    </Page>
  )
}
