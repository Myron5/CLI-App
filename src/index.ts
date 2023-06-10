import yargs from "yargs";
import { contactsAPI } from "./contacts";
import { warning } from "./helpers";

import { IAction } from "./types";

const argv = yargs(process.argv.slice(2)).options({
  action: { type: "string" },
  id: { type: "string" },
  name: { type: "string" },
  email: { type: "string" },
  phone: { type: "string" },
}).argv;

invokeAction(argv as IAction);

// ---------------- INVOKE ACTION ----------------

function invokeAction({ action, id, name, email, phone }: IAction) {
  switch (action) {
    case "list":
      contactsAPI.wrapped.listContacts();
      break;

    case "get":
      if (!id) {
        warning(`Missed id to get!`);
        break;
      }
      contactsAPI.wrapped.getContactById(id);
      break;

    case "remove":
      if (!id) {
        warning(`Missed id to remove!`);
        break;
      }
      contactsAPI.wrapped.removeContact(id);
      break;

    case "add":
      if (!name || !email || !phone) {
        const nameStr: string = !name ? "name" : "";
        const emailStr: string = !email ? "email" : "";
        const phoneStr: string = !name ? "phone" : "";
        warning(`There is no [${nameStr} ${emailStr} ${phoneStr}] to add!`);
        break;
      }
      contactsAPI.wrapped.addContact(name, email, phone);
      break;

    default:
      warning("Unknown action type!");
  }
}
