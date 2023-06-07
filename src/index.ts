import yargs from "yargs";
import { contactsAPI } from "./contacts";

import { IAction } from "types";

const argv = yargs(process.argv.slice(2)).options({
  action: { type: "string" },
  id: { type: "string" },
  name: { type: "string" },
  email: { type: "string" },
  phone: { type: "string" },
}).argv;

invokeAction(argv as IAction);

// ---------------- GET ALL HANDLER ----------------

function listContactsHandler() {
  contactsAPI
    .listContacts()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

// ---------------- GET ONE HANDLER ----------------

function getContactByIdHandler(id: string | undefined) {
  if (!id) {
    console.warn(`\x1B[31m Missed id to get!`);
    return;
  }

  contactsAPI
    .getContactById(id)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

// ---------------- DLETE HANDLER ----------------

function removeContactHandler(id: string | undefined) {
  if (!id) {
    console.warn(`\x1B[31m Missed id to remove!`);
    return;
  }

  contactsAPI
    .removeContact(id)
    .then((contact) => {
      console.log("Successfully deleted");
      console.log(contact);
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

// ---------------- ADD HANDLER ----------------

function addContactHandler(
  name: string | undefined,
  email: string | undefined,
  phone: string | undefined
) {
  if (!name || !email || !phone) {
    const nameStr = !name ? "name" : "";
    const emailStr = !email ? "email" : "";
    const phoneStr = !phone ? "phone" : "";

    const message = `\x1B[31m There is no [${nameStr} ${emailStr} ${phoneStr}] to add!`;
    console.warn(message);
    return;
  }

  contactsAPI
    .addContact(name, email, phone)
    .then((contact) => {
      console.log("Successfully added");
      console.log(contact);
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

// ---------------- INVOKE ACTION ----------------

function invokeAction({ action, id, name, email, phone }: IAction) {
  switch (action) {
    case "list":
      listContactsHandler();
      break;

    case "get":
      getContactByIdHandler(id);
      break;

    case "remove":
      removeContactHandler(id);
      break;

    case "add":
      addContactHandler(name, email, phone);
      break;

    default:
      console.warn(`\x1B[31m Unknown action type!`);
  }
}
