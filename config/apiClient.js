import httpClient from '../lib/httpClient'


//export default httpClient({baseUrl: 'http://10.0.1.2:3005'})
export default httpClient({baseUrl: process.browser ? '' : 'http://localhost:3000'})
