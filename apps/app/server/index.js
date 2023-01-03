const express = require('express')
const compression = require('compression')
const { renderPage } = require('vite-plugin-ssr')
const sirv = require('sirv')
const path = require('path')

const staticPath = path.join(__dirname, '..', 'dist', 'client')

async function startServer() {
  const app = express()

  app.use(compression())

  app.use(sirv(staticPath))

  // eslint-disable-next-line consistent-return
  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
    }
    console.log(pageContextInit)
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    }
    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
}

startServer()
