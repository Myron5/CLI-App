import * as fs from "node:fs/promises";
import * as path from "node:path";
import { randomUUID } from "node:crypto";
import { IContact } from "types";

class ContactsAPI {
  private contactsPath: string;

  constructor() {
    this.contactsPath = path.join(
      __dirname,
      "../",
      "src",
      "db",
      "contacts.json"
    );
  }

  // ---------------- GET ALL ----------------
  async listContacts(): Promise<IContact[]> {
    const result = JSON.parse(await fs.readFile(this.contactsPath, "utf-8"));
    if (!result) throw new Error("\x1B[31m Contacts wasn't found");
    return result;
  }

  // ---------------- GET ONE ----------------
  async getContactById(contactId: string): Promise<IContact> {
    const contacts: IContact[] = await this.listContacts();

    const contact: IContact | undefined = contacts.find(
      (contact) => contact.id === contactId
    );
    if (!contact) throw new Error("\x1B[31m There is no such contact");

    return contact;
  }

  // ---------------- DELETE ----------------
  async removeContact(contactId: string): Promise<IContact> {
    const contacts: IContact[] = await this.listContacts();

    const index: number = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (index === -1) throw new Error("\x1B[31m There is no such contact");
    const [delContact]: IContact[] = contacts.splice(index, 1);

    await fs.writeFile(this.contactsPath, JSON.stringify(contacts));

    return delContact;
  }

  // ---------------- ADD ----------------
  async addContact(
    name: string,
    email: string,
    phone: string
  ): Promise<IContact> {
    const contacts: IContact[] = await this.listContacts();

    const id: string = randomUUID();
    const newContact: IContact = { id, name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(this.contactsPath, JSON.stringify(contacts));

    return newContact;
  }
}

export const contactsAPI = new ContactsAPI();
