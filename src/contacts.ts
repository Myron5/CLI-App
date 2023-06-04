// const { promises: fs } = require("fs");
// const path = require("path");
import { promises as fs } from "fs";
import * as path from "path";
import { nanoid } from "nanoid";
import { IContact } from "types";

const contactsPath = path.join(__dirname, "../", "src", "db", "contacts.json");

// ---------------------------------------------- GET ALL ----------------------------------------------

export const listContacts = async (): Promise<IContact[]> => {
  const buffer: Buffer = await fs.readFile(contactsPath);
  const str: string = buffer.toString();
  const data: IContact[] = JSON.parse(str);
  return data;
};

// ---------------------------------------------- GET ONE ----------------------------------------------

export const getContactById = async (contactId: string): Promise<IContact> => {
  const contacts = await listContacts();
  if (!contacts) throw new Error("\x1B[31m Contacts wasn't found");

  const contact = contacts.find((contact) => contact.id === contactId);
  if (!contact) throw new Error("\x1B[31m There is no such contact");

  return contact;
};

// ---------------------------------------------- DELETE ----------------------------------------------

export const removeContact = async (contactId: string): Promise<IContact> => {
  const contacts = await listContacts();
  if (!contacts) throw new Error("\x1B[31m Contacts wasn't found");

  const idx = contacts.findIndex((contact) => contact.id === contactId);
  if (!~idx) throw new Error("\x1B[31m There is no such contact");
  const [delContact] = contacts.splice(idx, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return delContact;
};

// ---------------------------------------------- ADD ----------------------------------------------

export const addContact = async (
  name: string,
  email: string,
  phone: string
): Promise<IContact> => {
  const contacts = await listContacts();
  if (!contacts) throw new Error("\x1B[31m Contacts wasn't found");

  const id = nanoid();
  const newContact: IContact = { id, name, email, phone };
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return newContact;
};
