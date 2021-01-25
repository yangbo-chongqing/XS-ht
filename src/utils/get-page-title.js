import defaultSettings from '@/settings'

const title = defaultSettings.title || '寻声扫码'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
