import express, {Request, Response} from 'express'
import http from 'http'
import { Park } from 'index';
const Themeparks = require('themeparks');

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(express.json({strict: true}))

const apiList = {
  destinations: new Themeparks.DestinationsApi(),
  entities: new Themeparks.EntitiesApi(),
};

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
  })
})

app.get('/destinations', async (_req: Request, res: Response) => {
  try {
    const resp = await apiList.destinations.getDestinations();
    
    res.status(200).json({
      results: resp.destinations,
      total: resp.destinations.length,
    });
  } catch (e) {
    res.status(400).json({
      status: 'error',
      message: e.message,
    })
  }
})

app.get('/entity/:entityId', async (req: Request, res: Response) => {
  try {
    const resp = await apiList.entities.getEntity(req.params.entityId as string);

    res.status(200).json(resp)
  } catch (e) {
    res.status(400).json({
      status: 'error',
      message: e.message,
    })
  }
})

app.get('/parks', async (_req: Request, res: Response) => {
  const parks: Partial<Park>[] = []

  try {
    const destResp = await apiList.destinations.getDestinations();
    for await (const dest of destResp.destinations) {
      const childResp = await apiList.entities.getEntityChildren(dest.id);
      for (const child of childResp.children) {
        if (child.entityType === 'PARK') {
          parks.push({
            id: child.id,
            name: child.name,
            entityType: child.entityType,
          })
        }
      }
    }

    res.status(200).json({
      results: parks,
      total: parks.length,
    })
  } catch (e) {
    res.status(400).json({
      status: 'error',
      message: e.message,
    })
  }
})

app.get('/entity/:entityId/live', async (req: Request, res: Response) => {
  try {
    const resp = await apiList.entities.getEntityLiveData(req.params.entityId);
    res.status(200).json(resp)
  } catch (e) {
    res.status(400).json({
      status: 'error',
      message: e.message,
    })
  }
})

app.get('/entity/:entityId/schedule', async (req: Request, res: Response) => {  
  try {
    const resp = await apiList.entities.getEntityScheduleUpcoming(req.params.entityId);
    res.status(200).json(resp)
  } catch (e) {
    res.status(400).json({
      status: 'error',
      message: e.message,
    })
  }
})

server.listen(PORT, () => {
  console.log(`App started http://localhost:${PORT}`)
})
