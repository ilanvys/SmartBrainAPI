# SmartBrainAPI

**SmartBrainAPI** is the server-side component of the Smart-Brain web application. It provides the back-end services needed to support the front-end application, enabling user registration and image recognition.

## Features

- Face detection in images.
- General image recognition for image description.
- User registration and sign-in.
- User profile management.
- Keeps track of the number of images processed.

## Getting Started

To set up and run the **SmartBrainAPI** server, follow these steps:

1. Clone this repository to your local system.
2. Navigate to the project's root directory.
3. Run `npm install` to install the project dependencies.
4. Configure the environment variables:
   - Create a `.env` file with the following variables:
     - `DATABASE_URL`: Your PostgreSQL database connection URL.
     - `CLARIFAI_API_KEY`: Your Clarifai API key.
     - `PORT`: Port number for the server.
5. Start the server with `npm start`.

## Endpoints

**SmartBrainAPI** exposes the following API endpoints:

- `POST /register`: User registration.
- `POST /signin`: User sign-in.
- `GET /profile/:id`: Retrieve user profile.
- `PUT /image`: Increase user image count.
- `POST /imageurl`: Submit an image URL for face detection.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Clarifai Face Detection API](https://www.clarifai.com/)
- [Clarifai General Image Recognition API](https://www.clarifai.com/)

## Contributors

- Ilan Vysokovsky

## Acknowledgments

- [Zero to Mastery](https://zerotomastery.io/)

## License

This project is open-source and available under the [MIT License](LICENSE).
