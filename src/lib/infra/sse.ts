import { axiosInstance } from '@/lib/infra/axios'
import { router } from '@/router'
import { useAuthStore } from '@/stores/authStore'
import type { SseEventName } from '@/types/api'

const RECONNECT_DELAY_MS = 5000

type SseCallback = (data: string) => void

export class SseClient {
  private handlers: Map<string, SseCallback[]> = new Map()
  private abortController: AbortController | null = null
  private _isConnected = false

  private connectionListeners = new Set<(connected: boolean) => void>()

  get isConnected(): boolean {
    return this._isConnected
  }

  subscribeConnection(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener)
    listener(this._isConnected)
    return () => {
      this.connectionListeners.delete(listener)
    }
  }

  on(eventName: SseEventName, callback: SseCallback): void {
    const existing = this.handlers.get(eventName) ?? []
    this.handlers.set(eventName, [...existing, callback])
  }

  off(eventName: SseEventName, callback: SseCallback): void {
    const existing = this.handlers.get(eventName) ?? []
    this.handlers.set(
      eventName,
      existing.filter((h) => h !== callback),
    )
  }

  connect(): void {
    this.disconnect()
    this.abortController = new AbortController()
    void this.run(this.abortController)
  }

  disconnect(): void {
    this.abortController?.abort()
    this.abortController = null
    this.setConnected(false)
  }

  private setConnected(connected: boolean): void {
    if (this._isConnected === connected) return
    this._isConnected = connected
    this.connectionListeners.forEach((listener) => listener(connected))
  }

  private dispatch(eventName: string, data: string): void {
    const callbacks = this.handlers.get(eventName) ?? []
    callbacks.forEach((cb) => cb(data))
  }

  private async run(controller: AbortController): Promise<void> {
    const signal = controller.signal

    while (!signal.aborted) {
      const token = useAuthStore.getState().token

      try {
        const baseURL = axiosInstance.defaults.baseURL
        if (!baseURL) throw new Error('서버 주소가 설정되지 않았습니다.')
        const response = await fetch(`${baseURL}/api/events/stream`, {
          headers: {
            Accept: 'text/event-stream',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal,
        })

        if (response.status === 401) {
          useAuthStore.getState().clearToken()
          void router.navigate({ to: '/login' })
          break
        }

        if (!response.ok || !response.body) {
          throw new Error(`SSE 연결 실패: ${response.status}`)
        }

        this.setConnected(true)

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let eventName = ''
        let dataLines: string[] = []
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim()
            } else if (line.startsWith('data:')) {
              dataLines.push(line.slice(5).trim())
            } else if (line.trim() === '') {
              if (eventName || dataLines.length > 0) {
                this.dispatch(eventName, dataLines.join('\n'))
                eventName = ''
                dataLines = []
              }
            }
          }
        }
      } catch (err) {
        if (signal.aborted) break
        this.setConnected(false)
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, RECONNECT_DELAY_MS)
          signal.addEventListener(
            'abort',
            () => {
              clearTimeout(timer)
              resolve()
            },
            { once: true },
          )
        })
      }
    }

    this.setConnected(false)
  }
}

export const sseClient = new SseClient()
