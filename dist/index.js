"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const contacts_1 = require("./contacts");
const argv = (0, yargs_1.default)(process.argv.slice(2)).options({
    action: { type: "string" },
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
}).argv;
invokeAction(argv);
// ---------------- GET ALL HANDLER ----------------
function listContactsHandler() {
    contacts_1.contactsAPI
        .listContacts()
        .then((data) => {
        console.log(data);
    })
        .catch((err) => {
        console.warn(err.message);
    });
}
// ---------------- GET ONE HANDLER ----------------
function getContactByIdHandler(id) {
    if (!id) {
        console.warn(`\x1B[31m Missed id to get!`);
        return;
    }
    contacts_1.contactsAPI
        .getContactById(id)
        .then((data) => {
        console.log(data);
    })
        .catch((err) => {
        console.warn(err.message);
    });
}
// ---------------- DLETE HANDLER ----------------
function removeContactHandler(id) {
    if (!id) {
        console.warn(`\x1B[31m Missed id to remove!`);
        return;
    }
    contacts_1.contactsAPI
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
function addContactHandler(name, email, phone) {
    if (!name || !email || !phone) {
        const nameStr = !name ? "name" : "";
        const emailStr = !email ? "email" : "";
        const phoneStr = !phone ? "phone" : "";
        const message = `\x1B[31m There is no [${nameStr} ${emailStr} ${phoneStr}] to add!`;
        console.warn(message);
        return;
    }
    contacts_1.contactsAPI
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
function invokeAction({ action, id, name, email, phone }) {
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
