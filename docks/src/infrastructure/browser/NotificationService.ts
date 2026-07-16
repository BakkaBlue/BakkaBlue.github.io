// ==================== Notification Service Interface + Browser Implementation ====================

/**
 * Options for sending a notification.
 */
export interface NotificationOptions {
  title: string
  body?: string
  icon?: string
}

/**
 * Abstract notification service.
 * Platform-specific implementations handle permission requests and dispatch.
 */
export interface NotificationService {
  /** Request notification permission from the OS. Returns true if granted. */
  requestPermission(): Promise<boolean>

  /** Send a notification with the given options. */
  send(options: NotificationOptions): Promise<void>

  /** Convenience: send a simple notification with title and optional body. */
  sendNotification(title: string, body?: string): Promise<void>
}

// ---- Browser Implementation ----

/**
 * Browser notification service using the Web Notification API.
 * Requests permission lazily on the first send, then caches the result.
 */
export class BrowserNotificationService implements NotificationService {
  private _permissionGranted: boolean | null = null

  async requestPermission(): Promise<boolean> {
    if (typeof Notification === 'undefined') return false
    if (this._permissionGranted !== null) return this._permissionGranted

    const result = await Notification.requestPermission()
    this._permissionGranted = result === 'granted'
    return this._permissionGranted
  }

  async send(options: NotificationOptions): Promise<void> {
    const ok = await this.requestPermission()
    if (!ok) return

    new Notification(options.title, {
      body: options.body,
      icon: options.icon,
    })
  }

  async sendNotification(title: string, body?: string): Promise<void> {
    await this.send({ title, body })
  }
}
