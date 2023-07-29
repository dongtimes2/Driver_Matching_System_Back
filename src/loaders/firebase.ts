import admin from "firebase-admin";
import { SERVICE_SECRET_KEY } from "../config/secretKey.js";

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_SECRET_KEY),
});

export { admin };
