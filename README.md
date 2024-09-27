# URL Shortener Microservice

Microservice that generates a short URL from an input URL. Short URL redirects to the input URL. Uses Node, Express and MongoDB. FCC Backend API course final project.

Instructions:

- npm install
- npm run start

View:

- Replit:
    - <https://replit.com/@sfraser-dev/boilerplate-project-urlshortener>
- Glitch:
    - <https://cyan-neighborly-windshield.glitch.me> 

Usage:

- On the loaded (eg: "127.0.0.1:3000")
    - Input an URL (eg: "www.bbc.com") and press "POST URL"
- You'll be taken to page "127.0.0.1:3000/api/shorturl"
    - Copy the generated "short_url" value (eg: "777888999")
- Navigate to page "127.0.0.1:3000/api/shorturl/777888999"
    - You'll be redirected to "www.bbc.co.uk"
