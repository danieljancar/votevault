import * as process from 'process'

const API_URL = process.env['API_URL'] || 'http://localhost:3000'
const CONTRACT_ID =
  process.env['CONTRACT_ID'] ||
  'CA3W3T64RSIOLMFJZCYLAZFQIWOHZZQQQPNFC4NTA5U27G5GDPABZO5T'
const TEST_ACCOUNT =
  process.env['TEST_ACCOUNT'] ||
  'SD45R4RQCOSOSS3VJWQS7JK7KP34YMLVHSGSMIOZYAHK6KZSOJFDIIM7'
export { API_URL, CONTRACT_ID, TEST_ACCOUNT }
