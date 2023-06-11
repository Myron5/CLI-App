import * as fs from "node:fs/promises";
import * as path from "node:path";
import { randomUUID } from "node:crypto";

import { warning } from "./helpers";

import { IContact } from "./types";

class ContactsAPI {
  private contactsPath;
  public wrapped;

  constructor() {
    this.contactsPath = path.join(
      __dirname,
      "../",
      "src",
      "db",
      "contacts.json"
    );

    type listType = typeof this.listContacts;
    type getType = typeof this.getContactById;
    type removeType = typeof this.removeContact;
    type addType = typeof this.addContact;

    // ---------------- WRAPPED ----------------
    this.wrapped = {
      listContacts: this.promiseWrapper<
        Parameters<listType>,
        ReturnType<listType>
      >(this.listContacts),

      getContactById: this.promiseWrapper<
        Parameters<getType>,
        ReturnType<getType>
      >(this.getContactById),

      removeContact: this.promiseWrapper<
        Parameters<removeType>,
        ReturnType<removeType>
      >(this.removeContact, "Successfully deleted"),

      addContact: this.promiseWrapper<Parameters<addType>, ReturnType<addType>>(
        this.addContact,
        "Successfully added"
      ),
    };
  }

  // ---------------- GET ALL ----------------
  async listContacts(): Promise<IContact[]> {
    const result = JSON.parse(await fs.readFile(this.contactsPath, "utf-8"));
    if (!result) throw new Error("Contacts wasn't found");
    return result;
  }

  // ---------------- GET ONE ----------------
  async getContactById(contactId: string): Promise<IContact> {
    const contacts: IContact[] = await this.listContacts();

    const contact: IContact | undefined = contacts.find(
      (contact) => contact.id === contactId
    );
    if (!contact) throw new Error("There is no such contact");

    return contact;
  }

  // ---------------- DELETE ----------------
  async removeContact(contactId: string): Promise<IContact> {
    const contacts: IContact[] = await this.listContacts();

    const index: number = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (index === -1) throw new Error("There is no such contact");
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

  // ---------------- PROMISE-WRAPPER ----------------
  promiseWrapper<A extends Array<any>, R>(
    callback: (...a: A) => R,
    extraMessage: string = ""
  ) {
    const returnFunc = async (...args: A) => {
      try {
        console.log(await callback.apply(this, args));
        if (extraMessage) console.log(extraMessage);
      } catch (err: any) {
        warning(err.message);
      }
    };

    return returnFunc;
  }
}

export const contactsAPI = new ContactsAPI();
