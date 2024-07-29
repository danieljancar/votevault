import * as process from 'process'

const API_URL = process.env['API_URL'] || 'http://localhost:3000'
const CONTRACT_ID =
  process.env['CONTRACT_ID'] ||
  'CC7I6TM4NE3ZLHXGPWUMBUMLSMBCR5NSDX72OOLCFRICYEZ6NZPQEVGR'

export { API_URL, CONTRACT_ID }
