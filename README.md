<h1 align="center">
<br>
  <img src="https://user-images.githubusercontent.com/29043938/162579519-748732e4-51b3-42f4-b04b-a015520f80a8.png" style="width: 80px;" />
<br>
Eino
</h1>
<div align="center">
<h4>Book and movie tracker with web and Android clients.</h4>
<h4>You can find backend code <a href="https://github.com/jankku/eino-backend/">here</a> and Android code <a href="https://github.com/jankku/eino-android/">here</a>.</h4>
</div>

## Run project

Create `.env` file.

```sh
$ touch .env
```

In `.env` file, create `VITE_BASE_URL` variable, and fill it with Eino backend URL.

```sh
$ echo "VITE_BASE_URL=<URL>" > .env
```

Install dependencies.

```sh
$ npm install
```

Start development server.

```sh
$ npm start
```

## Build
Build minified production version with the following command.

```sh
$ npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit tests, and [Playwright](https://playwright.dev/) for end-to-end tests.

Before running E2E tests, make sure that backend is running and that `REACT_APP_BASE_URL` environment variable is set.

```sh
# Run unit tests
$ npm run test:unit

# Run e2e tests
$ npm run test:e2e

# Run both unit and e2e tests
$ npm run test
```

## License
Licensed under the [MIT License](https://github.com/Jankku/eino-web/blob/master/LICENSE.md).