# Spotify Guesser

This project is a React application built with TypeScript that integrates with the Spotify Web API, enabling you to play a music guessing game with your friends using Spotify's extensive music library. You could try a live demo at [spotiguess.jossafossa.nl](https://spotiguess.jossafossa.nl) if spotify would allow me to set the API in production mode. But unfortunately spotify requires you to have 250K active users 🎉.

## Key Features

- User authentication with Spotify
- Available in 5 languages
- Play music guessing game with friends
- Keeps a record of played songs
- Responsive design for mobile and desktop

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:jossafossa/spotify-guesser.git
   cd spotify-guesser
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```env
     VITE_SPOTIFY_CLIENT_ID=<your-spotify-client-id>
     ```

4. Start the development server:

   ```bash
   pnpm run dev
   ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License.
