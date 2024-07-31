import * as process from 'process'

const API_URL = process.env['API_URL'] || 'http://localhost:3000'
const CONTRACT_ID = process.env['CONTRACT_ID'] || ''
const TEST_ACCOUNT = process.env['TEST_ACCOUNT'] || ''
export { API_URL, CONTRACT_ID, TEST_ACCOUNT }
