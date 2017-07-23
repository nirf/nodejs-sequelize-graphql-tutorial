const Express = require('express')
const GraphHTTP = require('express-graphql')
const Schema = require('./Schema')


//Config
const APP_PORT = 3000

const app = Express();

app.use('/graphql', GraphHTTP({
    schema: Schema.Schema,
    pretty: true,
    graphiql: true
}))

app.listen(APP_PORT, () => {
    console.log(`App listening on port ${APP_PORT}`)
})

