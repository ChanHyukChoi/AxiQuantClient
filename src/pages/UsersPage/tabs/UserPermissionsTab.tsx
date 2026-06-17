import { Check } from 'lucide-react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/primitive/Checkbox'
import {
  PERMISSION_CATEGORIES,
  isFullPermissions,
  mergePermission,
  setAllPermissions,
  setCategoryPermissions,
  type PermissionCategoryDef,
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

const categoryBtnStyle = (active: boolean): React.CSSProperties => ({
  fontSize: 12,
  padding: '2px 6px',
  borderRadius: 4,
  border: '0.5px solid var(--color-btn-default-border)',
  background: active ? 'var(--color-btn-accent-bg)' : 'transparent',
  color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
})

interface CategoryBulkButtonsProps {
  category: PermissionCategoryDef
  permissions: UserPermissions
  onChange: (perms: UserPermissions) => void
}

const CategoryBulkButtons = ({ category, permissions, onChange }: CategoryBulkButtonsProps) => {
  const { t } = useTranslation('nav')

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {(['read', 'write', 'all'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          className="transition-colors"
          style={categoryBtnStyle(false)}
          onClick={() => onChange(setCategoryPermissions(permissions, category, mode))}
        >
          {t(`permission.ui.${mode}`)}
        </button>
      ))}
    </div>
  )
}

export const UserPermissionsTab = ({
  editMode,
  control,
  permissions,
  onPermissionsChange,
}: UserPermissionsTabProps) => {
  const { t } = useTranslation('nav')
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
              {t('permission.ui.allowAll')}
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
                {fullAllow ? t('permission.ui.allowed') : t('permission.ui.individual')}
              </span>
            )}
          </div>

          {PERMISSION_CATEGORIES.map((cat) => (
            <section key={cat.categoryKey}>
              <div
                className="flex items-center justify-between gap-2 mb-2 pb-1"
                style={{ borderBottom: '0.5px solid var(--color-border)' }}
              >
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-subtle)' }}>
                  {t(`permission.category.${cat.categoryKey}`)}
                </p>
                {editMode && !fullAllow ? (
                  <CategoryBulkButtons
                    category={cat}
                    permissions={permissions}
                    onChange={onPermissionsChange}
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-1">
                {cat.items.map((item) => {
                  const p = permissions[item.key] ?? { read: false, write: false }
                  const itemDisabled = editMode && fullAllow
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 py-1.5 px-1"
                      style={{ borderBottom: '0.5px solid var(--color-border-subtle)' }}
                    >
                      <span className="text-[14px] flex-1 min-w-0" style={{ color: 'var(--color-text)' }}>
                        {t(`permission.item.${item.key}`)}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <label className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                          {editMode ? (
                            <Checkbox
                              checked={p.read}
                              disabled={itemDisabled}
                              onChange={(checked) =>
                                onPermissionsChange(
                                  mergePermission(permissions, item.key, 'read', checked, item.readOnly),
                                )
                              }
                            />
                          ) : (
                            <PermIcon checked={p.read} />
                          )}
                          {t('permission.ui.read')}
                        </label>
                        {!item.readOnly && (
                          <label className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                            {editMode ? (
                              <Checkbox
                                checked={p.write}
                                disabled={itemDisabled || !p.read}
                                onChange={(checked) =>
                                  onPermissionsChange(
                                    mergePermission(
                                      permissions,
                                      item.key,
                                      'write',
                                      checked,
                                      item.readOnly,
                                    ),
                                  )
                                }
                              />
                            ) : (
                              <PermIcon checked={p.write} />
                            )}
                            {t('permission.ui.write')}
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
