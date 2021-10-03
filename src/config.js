import dotenv from "dotenv"

// todo: not loading Heroku's config-vars
// execute dotenv configuration
dotenv.config()
console.log("config.js: ", process.env)
