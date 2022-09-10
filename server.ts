import express, {Request, Response} from 'express'
import http from 'http'
import {Park} from 'index'
import Themeparks from 'themeparks'
import fs from 'fs'
import _ from 'lodash'

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3000
const dataDir = process.env.DATA_PATH as string
if (!dataDir) {
  throw new Error('Must be set DATA_PATH environment variable')
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}
Themeparks.Settings.Cache = `${dataDir}/themeparks.db`

app.use(express.json({strict: true}))

const Parks: {[key: string]: Park} = {}
for (const park in Themeparks.Parks) {
  const parkObj: Park = new Themeparks.Parks[park]({
    cacheWaitTimesLength: 300,
    cacheOpeningTimesLength: 3600,
    scheduleDaysToReturn: 60,
  })
  const id = _.snakeCase(parkObj.Name)
  if (_.has(Parks, id)) {
    console.warn(`Park is exists: ${parkObj.Name}`)
  }

  _.set(Parks, id, parkObj)
}
for (const park in Parks) {
  console.log(`* ${Parks[park].Name} [${Parks[park].LocationString}]: (${Parks[park].Timezone})`)
}

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
  })
})

app.get('/parks', (_req: Request, res: Response) => {
  const parks = []
  Object.keys(Parks).forEach((parkId) => {
    const park = Parks[parkId]
    parks.push({
      id: parkId,
      name: park.Name,
      location: park.LocationString,
      latitude: park.Latitude,
      longitude: park.Longitude,
      timeZone: park.Timezone,
      mapUrl: park.toGoogleMaps(),
    })
  })

  res.status(200).json({
    status: 'ok',
    parks,
    parks_total: parks.length,
  })
})

app.get('/parks/:parkId/wait-times', (req: Request, res: Response) => {
  const parkId = req.params.parkId as string
  if (!parkId || !Parks[parkId]) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid park ID.',
    })

    return
  }

  Parks[parkId]
    .GetWaitTimes()
    .then(rideTimes => rideTimes.filter(item => item.waitTime !== null))
    .then((rideTimes) => {
      res.status(200).json({
        status: 'ok',
        results: rideTimes.map(item => ({
          ...item,
          id: String(item.id),
        })),
        results_total: rideTimes.length,
      })
    })
    .catch((err) =>
      res.status(400).json({
        status: 'error',
        message: err.toString(),
      })
    )
})

app.get('/parks/:parkId/opening-times', (req: Request, res: Response) => {
  const parkId = req.params.parkId as string
  if (!parkId || !Parks[parkId]) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid park ID.',
    })

    return
  }

  Parks[parkId]
    .GetOpeningTimes()
    .then((results) =>
      res.status(200).json({
        status: 'ok',
        results,
        results_total: results.length,
      })
    )
    .catch((err) =>
      res.status(400).json({
        status: 'error',
        message: err.toString(),
      })
    )
})

server.listen(PORT, () => {
  console.log(`App started http://localhost:${PORT}`)
})
