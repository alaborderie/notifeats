const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const axios = require('axios').default
const cheerio = require('cheerio')
const cron = require('cron')

app.use(bodyParser.json())

app.post('/notify', async (req, res) => {
  try {
    const page = await getPage(req.body.url)
    if (await isAvailable(page.data)) {
      res.sendStatus(200)
    } else {
      const job = await startJob(req.body.url, req.body.maxDate)
      res.sendStatus(job ? 201 : 500)
    }
  } catch (e) {
    res.sendStatus(400)
  }
})

app.get('*', express.static('./static'))

app.listen(6969, () => {
  console.log('Starting app...')
  console.log('Listening on port 6969.')
})

const isAvailable = async (restaurant) => {
  const $ = cheerio.load(restaurant)
  return !$('#wrapper').children().eq(1).children().eq(1).children().eq(1).children().eq(1).first().children().eq(2).html()
}

const getPage = async (url) => {
  return axios(url, {
    headers: { Accept: 'text/html' }
  })
}

const startJob = async (url, maxDate) => {
  try {
    cron.job('*/10 * * * * *', async function () {
      if (Date.now() > maxDate) {
        console.log('Stopping as cron expired...')
        this.stop()
      } else {
        console.log('scraping uber eats')
        const page = await getPage(url)
        if (await isAvailable(page.data)) {
          console.log('Available, stopping...')
          this.stop()
        }
      }
    }, null, true, 'Europe/Paris')
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
