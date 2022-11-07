# fragments

Fragments is the microservice API to store various types of reports and images in cloud system. It is deployed in AWS EC2 and the app is dockerized so that it can be easily deployed in a large scale. User information is stored in AWS Cognito separately to minimize security concern.

Supported types of content are as below.

- text/plain
- text/plain; charset=utf-8
- text/markdown
- text/html
- application/json
- image/png
- image/jpeg
- image/webp

## API Usage

| Method | API                    | Description                                                                                                                                                 |
| ------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /v1/fragments          | Return response status with fragment metadata                                                                                                               |
| GET    | /v1/fragments          | Return response status with a list of all fragment IDs that are owned by the current user. By adding `expand=1` query, fragments metadata is also included. |
| GET    | /v1/fragments/:id      | Return fragment content. By adding `html` extension, content will be converted into `html` format. (e.g. `/v1/fragments/:id.html`)                          |
| GET    | /v1/fragments/:id/info | Return the metadata for requested fragment ID                                                                                                               |

### Fragment Metadata Format

```json
{
  "status": "ok",
  "fragment": {
    "id": "30a84843-0cd4-4975-95ba-b96112aea189",
    "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    "created": "2021-11-02T15:09:50.403Z",
    "updated": "2021-11-02T15:09:50.403Z",
    "type": "text/plain",
    "size": 256
  }
}
```

## Scripts

To validate lint errors `npm lint` <br>
To run the server `npm start` <br>
To run dev server with dev logger and nodemon `npm dev` <br>
To run debug mode `npm debug`
To run tests, use `npm run test` and `npm run coverage`

## Revision

| Version | Release Content                                               | Date         |
| ------- | ------------------------------------------------------------- | ------------ |
| 0.5.0   | Add /v1/fragments/:id/info and html conversion capability     | Nov 6, 2022  |
| 0.4.0   | Support all text contents and Dockerize                       | Oct 17, 2022 |
| 0.3.0   | Add user email hashing and update GET POST response structure | Oct 4, 2022  |
| 0.2.0   | Add Fragment class, post route and tests                      | Sep 28, 2022 |
| 0.1.0   | Basic Server & dev env setup<br>                              | Sep 9, 2022  |
