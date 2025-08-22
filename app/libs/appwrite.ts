import { Client, Databases, Account, ID } from "appwrite";
import { APP_WRITE_ID } from "~/constants/app.constants";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(APP_WRITE_ID);

export const ACCOUNT = new Account(client);
export const UNIQUE_ID = ID.unique()
export const DATABASE = new Databases(client);
