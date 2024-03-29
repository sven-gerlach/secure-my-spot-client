# Secure-My-Spot: Front-End

## TLDR
- This application offers a convenient way for users to locate, reserve, and pay for on-street parking in New York City
- The app is a Dockerised JavaScript / TypeScript front-end application based on the React library
- Nginx server delivers all public resources when deployed on Heroku or Google Cloud
- Google Maps implementation with a custom geographic depiction of available parking spots using GPS coordinates
- Polling of Django / PostgreSQL back-end ensures only available parking spots are displayed on Google Map
- Users can pick an available parking spot and choose the length of the reservation period
- Custom in-app Stripe payments and processing flow, using setup intent and payment intent objects
- Reservation of parking spots is only confirmed upon successful completion of Stripe payment processing whereby card details are collected for later charging
- Celery, RabbitMQ, and Redis are used to set up tasks that need to be executed by the back-end at the end of the reservation period 
- Users can change the reservation length or end a reservation at any time, either case results in an email sent to the user to confirm any amendments to the reservation
- At the end of the reservation period the message broker pushes end-of-reservation tasks to Celery for execution, including sending an end-of-reservation email to the user and changing the state of the reserved parking spot resource from reserved to available in the PostgreSQL backend
- Jest and React testing library have been used for unit testing / test-driven-development

## Technologies used for the Front- and Back-End
| Technology              | Front-End | Back-End |
|:------------------------|:---------:|:--------:|
| Axios                   |     x     |          |
| Black                   |           |    x     |
| Bootstrap               |     x     |          |
| Camelcase               |     x     |          |
| Celery                  |           |    x     |
| Certbot / Let's Encrypt |           |    x     |
| Coverage                |     x     |    x     |
| Crypto.js               |     x     |          |
| CSS/SCSS                |     x     |          |
| Docker                  |     x     |    x     |
| Dotenv                  |     x     |          |
| Django                  |           |    x     |
| Django Rest Framework   |           |    x     |
| Factory Boy             |           |    x     |
| Faker                   |     x     |    x     |
| Flake8                  |           |    x     |
| Google Maps Api         |     x     |          |
| Gunicorn                |           |    x     |
| Heroku                  |           |    x     |
| HTML5                   |     x     |          |
| Husky                   |     x     |          |
| iSort                   |           |    x     |
| JavaScript              |     x     |          |
| Jest                    |     x     |          |
| Lodash                  |     x     |          |
| Luxon                   |     x     |          |
| Model Bakery            |           |    x     |
| Moment                  |     x     |          |
| Nginx                   |     x     |    x     |
| Pipenv                  |           |    x     |
| PostgreSQL              |           |    x     |
| Pytest                  |           |    x     |
| Redis                   |           |    x     |
| React                   |     x     |          |
| React Router-Dom        |     x     |          |
| TypeScript              |     x     |          |
| Stripe Api              |     x     |    x     |
| Styled Components       |     x     |          |
| Whitenoise              |           |    x     |

## Set-up & Installation for Local Development
1. Fork and clone the repo
2. Run `npm i`
3. Environment variables need to be injected using Doppler. Please ensure you have installed and authenticated Doppler as per their [documentation](https://docs.doppler.com/docs/install-cli).
4. Run `doppler setup` which will connect to the relevant environment configuration as per the [doppler.yaml](./doppler.yaml). The following environment variables should be set:
   - REACT_APP_SESSION_ENCRYPTION_KEY
   - REACT_APP_GOOGLE_MAPS_KEY
   - REACT_APP_STRIPE_API_TEST_KEY
   - REACT_APP_API_HOST
   - REACT_APP_CLIENT_HOST
5. Start the Docker container with `doppler run -- docker-compose -f docker-compose-dev.yml up -d --build` (Docker must be installed)
6. The app is running on `localhost:3000/`

## Deployment

### Render
The app is deployed on [Render](https://secure-my-spot.sigmagamma.app). A CI/CD pipeline has been set up for the main branch such that any change to that branch leads to auto-deployment.

### AWS Amplify
The app used to be deployed on AWS Amplify. A CI/CD pipeline has been set up for the main branch such that any change to that branch leads to auto-deployment.
> **Note**: environment variables (see above) need to be manually sourced from Doppler and entered into the Amplify platform

## Links
### Front-end
- [Deployed app](https://www.secure-my-spot.spa.sigmagamma.app)
- [Github repo](https://github.com/sven-gerlach/secure-my-spot-client)
- [Kanban](https://github.com/sven-gerlach/secure-my-spot-client/projects/1)
### Back-end
- [Deployed app](https://secure-my-spot.api.sigmagamma.app)
- [Github repo](https://github.com/sven-gerlach/secure-my-spot-api)
- [Kanban](https://github.com/sven-gerlach/secure-my-spot-api/projects/1)

## User Stories
- [x] Reserve a road-side parking spot which is unoccupied
- [x] Release / cancel reservation for parking spot (only pay for time used)
- [x] Find all available parking spots nearby
- [x] Reserve available parking spots (before physically driving there)
- [x] Flat-rate prices, pro-rated on a minute-by-minute basis
- [x] Database consistency must guarantee a reservation cannot be made more than once at a time
- [x] Checkout / pay for reservation

## ERD
![ERD Image](./development/Wireframe.PNG)

## Next Steps
- [ ] Replace polling of backend for all available parking spots with a websocket implementation
- [ ] Send user verification email after sign-up and after unauthenticated users enter their email before reserving a parking spot
- [ ] Allow users to securely store their payment details for future use, facilitating a fast check-out
- [ ] Implement parking spot filter (e.g. 300m radius) -> back-end filter already exists
