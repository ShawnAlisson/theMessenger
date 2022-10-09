<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ShaiiiaN/theMessenger">
    <img src="client/public/logo192.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">theMessenger</h3>

  <p align="center">
    Simple Messenger.
  </p>
</div>

### Built With

- Express - Node.js
- React
- MongoDB
- Socket.IO

<!-- GETTING STARTED -->

## Getting Started

1. Clone the repo

   ```sh
   git clone https://github.com/ShaiiiaN/theMessenger.git
   ```

2. Go to the client directory

   ```sh
   cd client/
   ```

3. Set Client Variables in `.env`

   ```shell
    REACT_APP_SERVER_URL= e.g. http://localhost:8000/api/v1
    REACT_APP_SOCKET_URI= e.g. http://localhost:8000
   ```

4. Go back to the root

   ```sh
   cd ..
   ```

5. Set Server Variables in `.env`

   ```shell
    PORT = e.g. 8000
    DB_URI= e.g. mongodb://127.0.0.1:27017
    TOKEN_SECRET= TOKEN
    NODE_ENV = production
   ```

6. Install NPM packages and Build

   ```sh
   npm run build
   ```

7. Run the server
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
