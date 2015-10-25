const createClient = require('../api/createClient')
const httpApiImpl = require('../api/http')

export default createClient(httpApiImpl({baseUrl: 'http://localhost:3005'}))
