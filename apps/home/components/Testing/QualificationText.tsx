import { useTranslation } from 'next-i18next'
import React from 'react'

export const QualificationText: React.FC<{
  isQualified?: boolean
}> = ({ isQualified }) => {
  const { t } = useTranslation('testing')
  return isQualified ? t('qualified-text') : t('not-qualified-text')
}
