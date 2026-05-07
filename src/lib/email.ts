// Client-side email trigger helpers — actual sending happens in /api/email/*

export interface InvoiceEmailPayload {
  to: string
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: string
  producerName: string
  portalLink?: string
}

export interface PortalInvitePayload {
  to: string
  clientName: string
  projectTitle: string
  producerName: string
  portalLink: string
}

export interface ContractEmailPayload {
  to: string
  clientName: string
  contractTitle: string
  producerName: string
  signLink: string
}

export async function sendInvoiceEmail(payload: InvoiceEmailPayload) {
  const res = await fetch('/api/email/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to send invoice email')
  return res.json()
}

export async function sendPortalInvite(payload: PortalInvitePayload) {
  const res = await fetch('/api/email/portal-invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to send portal invite')
  return res.json()
}

export async function sendContractEmail(payload: ContractEmailPayload) {
  const res = await fetch('/api/email/contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to send contract email')
  return res.json()
}
