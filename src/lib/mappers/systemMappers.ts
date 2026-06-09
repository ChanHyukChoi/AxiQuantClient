import { firstNumber, optionalString } from '@/lib/wire/wireJson'
import type { LicenseInfo } from '@/types/api/system'

export const wireToLicenseInfo = (row: Record<string, unknown>): LicenseInfo | null => {
  const keyId =
    optionalString(row, 'keyId') ??
    optionalString(row, 'keyID') ??
    optionalString(row, 'key_id')
  if (!keyId) return null

  return {
    keyId,
    maxReader: firstNumber(row, ['maxReader', 'max_reader']),
    maxClient: firstNumber(row, ['maxClient', 'max_client']),
    maxMap: firstNumber(row, ['maxMap', 'max_map']),
    valid: row.valid !== false && row.isValid !== false,
  }
}

export const parseLicenseInfo = (data: unknown): LicenseInfo | null => {
  if (data == null || typeof data !== 'object') return null
  const row = data as Record<string, unknown>
  const nested = row.license ?? row.licenseInfo ?? row.license_info
  if (nested && typeof nested === 'object') {
    return wireToLicenseInfo(nested as Record<string, unknown>)
  }
  return wireToLicenseInfo(row)
}
