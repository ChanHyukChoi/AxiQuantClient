import { Check } from 'lucide-react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import {
  PERMISSION_CATEGORIES,
  isFullPermissions,
  mergePermission,
  setAllPermissions,
} from '@/pages/UsersPage/permissions'
import type { UserEditFormValues } from '@/pages/UsersPage/formTypes'
import type { UserPermissions } from '@/types/api/user'

interface UserPermissionsTabProps {
  editMode: boolean
  control: Control<UserEditFormValues>
  permissions: UserPermissions
  onPermissionsChange: (perms: UserPermissions) => void
}

const PermIcon = ({ checked }: { checked: boolean }) =>
  checked ? (
    <Check size={14} style={{ color: 'var(--color-accent)' }} />
  ) : (
    <span style={{ width: 14, height: 14, display: 'inline-block' }} />
  )

export const UserPermissionsTab = ({
  editMode,
  control,
  permissions,
  onPermissionsChange,
}: UserPermissionsTabProps) => {
  const fullAllow = isFullPermissions(permissions)

  return (
    <Controller
      name="permissions"
      control={control}
      render={() => (
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center justify-between py-2 px-2 rounded"
            style={{ border: '0.5px solid var(--color-border)', background: 'var(--color-btn-hover)' }}
          >
            <span className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
              전체 허용
            </span>
            {editMode ? (
              <button
                type="button"
                onClick={() => onPermissionsChange(setAllPermissions(!fullAllow))}
                className="text-[13px] px-2 py-0.5 rounded"
                style={{
                  background: fullAllow ? 'var(--color-btn-accent-bg)' : 'transparent',
                  color: fullAllow ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  border: '0.5px solid var(--color-btn-default-border)',
                }}
              >
                {fullAllow ? 'ON' : 'OFF'}
              </button>
            ) : (
              <span className="text-[13px]" style={{ color: fullAllow ? '#4caf7d' : 'var(--color-text-dim)' }}>
                {fullAllow ? '허용됨' : '개별 설정'}
              </span>
            )}
          </div>

          {PERMISSION_CATEGORIES.map((cat) => (
            <section key={cat.category}>
              <p
                className="text-[13px] font-medium mb-2 pb-1"
                style={{ color: 'var(--color-text-subtle)', borderBottom: '0.5px solid var(--color-border)' }}
              >
                {cat.category}
              </p>
              <div className="flex flex-col gap-1">
                {cat.items.map((item) => {
                  const p = permissions[item.key] ?? { read: false, write: false }
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 py-1.5 px-1"
                      style={{ borderBottom: '0.5px solid var(--color-border-subtle)' }}
                    >
                      <span className="text-[14px] flex-1 min-w-0" style={{ color: 'var(--color-text)' }}>
                        {item.label}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <label className="flex items-center gap-1 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                          {editMode ? (
                            <input
                              type="checkbox"
                              checked={p.read}
                              onChange={(e) =>
                                onPermissionsChange(
                                  mergePermission(permissions, item.key, 'read', e.target.checked, item.readOnly),
                                )
                              }
                              className="accent-[var(--color-accent)]"
                            />
                          ) : (
                            <PermIcon checked={p.read} />
                          )}
                          읽기
                        </label>
                        {!item.readOnly && (
                          <label
                            className="flex items-center gap-1 text-[13px]"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {editMode ? (
                              <input
                                type="checkbox"
                                checked={p.write}
                                disabled={!p.read}
                                onChange={(e) =>
                                  onPermissionsChange(
                                    mergePermission(
                                      permissions,
                                      item.key,
                                      'write',
                                      e.target.checked,
                                      item.readOnly,
                                    ),
                                  )
                                }
                                className="accent-[var(--color-accent)]"
                              />
                            ) : (
                              <PermIcon checked={p.write} />
                            )}
                            쓰기
                          </label>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    />
  )
}
