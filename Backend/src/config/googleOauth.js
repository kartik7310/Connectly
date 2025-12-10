import { OAuth2Client } from "google-auth-library";
import { config } from "./env.js";


export const client = new OAuth2Client(config.googleClientId);