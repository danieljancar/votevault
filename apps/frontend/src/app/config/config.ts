import * as process from 'process'

const API_URL = process.env['API_URL'] || 'http://localhost:3000'
const CONTRACT_ID =
  process.env['CONTRACT_ID'] ||
  'CBBES5DBUZDWJOWD4M6YGNNMP6HFMLCIMNVFFF77DJN6GWWU6DWF5QNF'

export { API_URL, CONTRACT_ID }
