import { CaseDetailPage } from '../../../views/CaseDetailPage'

type CaseDetailRouteProps = {
  params: Promise<{ id: string }>
}

export default async function CaseDetailRoute({ params }: CaseDetailRouteProps) {
  const { id } = await params
  const caseId = Number(id)

  if (!Number.isFinite(caseId) || caseId <= 0) {
    return <CaseDetailPage caseId={-1} />
  }

  return <CaseDetailPage caseId={caseId} />
}
