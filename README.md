
# Video Downloader

Video Downloader is a Web App to download videos from:
- YouTube
- Reddit

## Run Locally

Clone the project

```bash
  git clone https://github.com/Lehxugo/Video-downloader.git
```

Go to the project directory

```bash
  cd Video-downloader
```
-- **Backend** --

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node index.js
```

-- **Frontend** --

Go to the frontend directory

```bash
  cd ..
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
## API Reference

Backend API endpoints.

#### Get YouTube video info

```http
  GET /youtube-info?URL=https:/youtube.com/watch/...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The YouTube video/Short URL |

#### Download YouTube video

```http
  GET /youtube-download?URL=https:/youtube.com/watch/...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The YouTube video/Short URL |

#### Get Reddit video info

```http
  GET /reddit-info?URL=https://www.reddit.com/r...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The Reddit video URL |

#### Download Reddit video

```http
  GET /reddit-download?URL=https://www.reddit.com/r...
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `URL`     | `string` | **Required**. The Reddit video URL |

