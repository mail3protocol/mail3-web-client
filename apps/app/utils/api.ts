import { AxiosResponse } from 'axios'

export async function catchApiResponse<T, V = null>(
  p: Promise<AxiosResponse<T>>,
  options?: {
    catchValue: V
  }
): Promise<T | V | null> {
  return p.then((r) => r.data).catch(() => options?.catchValue || null)
}
