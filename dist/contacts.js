"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactsAPI = void 0;
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
const node_crypto_1 = require("node:crypto");
class ContactsAPI {
    constructor() {
        this.contactsPath = path.join(__dirname, "../", "src", "db", "contacts.json");
    }
    // ---------------- GET ALL ----------------
    async listContacts() {
        const result = JSON.parse(await fs.readFile(this.contactsPath, "utf-8"));
        if (!result)
            throw new Error("\x1B[31m Contacts wasn't found");
        return result;
    }
    // ---------------- GET ONE ----------------
    async getContactById(contactId) {
        const contacts = await this.listContacts();
        const contact = contacts.find((contact) => contact.id === contactId);
        if (!contact)
            throw new Error("\x1B[31m There is no such contact");
        return contact;
    }
    // ---------------- DELETE ----------------
    async removeContact(contactId) {
        const contacts = await this.listContacts();
        const index = contacts.findIndex((contact) => contact.id === contactId);
        if (index === -1)
            throw new Error("\x1B[31m There is no such contact");
        const [delContact] = contacts.splice(index, 1);
        await fs.writeFile(this.contactsPath, JSON.stringify(contacts));
        return delContact;
    }
    // ---------------- ADD ----------------
    async addContact(name, email, phone) {
        const contacts = await this.listContacts();
        const id = (0, node_crypto_1.randomUUID)();
        const newContact = { id, name, email, phone };
        contacts.push(newContact);
        await fs.writeFile(this.contactsPath, JSON.stringify(contacts));
        return newContact;
    }
}
exports.contactsAPI = new ContactsAPI();
