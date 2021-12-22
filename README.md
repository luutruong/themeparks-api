# API for themeparks

## Installation

Clone this repo to your local

```bash
yarn install
```

Run in production:

```bash
yarn build
yarn start
```

Run in development:

```bash
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

Build image

```bash
docker build -f Dockerfile -t themeparks-api .
```

Run image:

```bash
docker run -d --name themeparks-api -p 3000:3000 -v "$PWD/data:/app/data" -t themeparks-api .
```

## API

### GET `/parks`

List all parks

Response:

```
{
  status: (string),
  parks: [
    {
      id: (string),
      name: (string),
      location: (string),
      latitude: (string),
      longitude: (string),
      timeZone: (string),
      mapUrl: (string)
    },
    ...
  ],
  parks_total: (int)
}
```

### GET `/parks/:parkId/wait-times`

List waiting times in specific park.

Response:

```
{
  status: (string),
  results: [
    {
      id: (string),
      name: (string),
      active: (bool),
      waitTime: (string),
      fastPass: (bool),
      lastUpdate: (string),
      status: (string)
    }
  ],
  results_total: (int)
}
```

### GET `/parks/:parkId/opening-times`

List opening times in specific park.

Response:

```
{
  status: (string),
  results: [
    {
      date: (string),
      openingTime: (string),
      closingTime: (string),
      type: (string),
      special: [
        {
          openingTime: (string),
          closingTime: (string),
          description: (string),
          type: (string)
        }
      ]
    }
  ],
  results_total: (int)
}
```
