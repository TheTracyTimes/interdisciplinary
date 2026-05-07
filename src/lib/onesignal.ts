const appId = import.meta.env.VITE_ONESIGNAL_APP_ID as string

export function initOneSignal() {
  if (!appId || typeof window === 'undefined') return
  // OneSignal Web SDK loaded via script tag in index.html
  ;(window as any).OneSignalDeferred = (window as any).OneSignalDeferred || []
  ;(window as any).OneSignalDeferred.push(async (OneSignal: any) => {
    await OneSignal.init({
      appId,
      safari_web_id: `web.onesignal.auto.${appId}`,
      notifyButton: { enable: false },
      allowLocalhostAsSecureOrigin: true,
    })
  })
}

export async function promptForPush() {
  const OneSignal = (window as any).OneSignal
  if (!OneSignal) return
  await OneSignal.Slidedown.promptPush()
}

// Send a notification via our API (server-side sends to specific user)
export async function sendNotification(payload: {
  userId: string
  title: string
  body: string
  url?: string
}) {
  await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export const NotificationTemplates = {
  invoicePaid: (amount: number) => ({
    title: 'Invoice paid',
    body: `$${amount.toLocaleString()} received.`,
    url: '/app/invoices',
  }),
  newMessage: (from: string) => ({
    title: 'New message',
    body: `${from} sent you a message.`,
    url: '/app/messages',
  }),
  contractSigned: (client: string) => ({
    title: 'Contract signed',
    body: `${client} signed your contract.`,
    url: '/app/contracts',
  }),
  projectUpdate: (project: string) => ({
    title: 'Project update',
    body: `${project} has been updated.`,
    url: '/app/projects',
  }),
}
