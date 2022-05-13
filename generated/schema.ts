// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Proposal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Proposal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Proposal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Proposal", id.toString(), this);
    }
  }

  static load(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get("Proposal", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value!.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get status(): BigInt {
    let value = this.get("status");
    return value!.toBigInt();
  }

  set status(value: BigInt) {
    this.set("status", Value.fromBigInt(value));
  }

  get image(): string {
    let value = this.get("image");
    return value!.toString();
  }

  set image(value: string) {
    this.set("image", Value.fromString(value));
  }
}

export class Metadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Metadata entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Metadata must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Metadata", id.toString(), this);
    }
  }

  static load(id: string): Metadata | null {
    return changetype<Metadata | null>(store.get("Metadata", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get description(): string {
    let value = this.get("description");
    return value!.toString();
  }

  set description(value: string) {
    this.set("description", Value.fromString(value));
  }

  get goal(): BigInt {
    let value = this.get("goal");
    return value!.toBigInt();
  }

  set goal(value: BigInt) {
    this.set("goal", Value.fromBigInt(value));
  }

  get init_date(): BigInt {
    let value = this.get("init_date");
    return value!.toBigInt();
  }

  set init_date(value: BigInt) {
    this.set("init_date", Value.fromBigInt(value));
  }

  get finish_date(): BigInt {
    let value = this.get("finish_date");
    return value!.toBigInt();
  }

  set finish_date(value: BigInt) {
    this.set("finish_date", Value.fromBigInt(value));
  }

  get funds(): BigInt {
    let value = this.get("funds");
    return value!.toBigInt();
  }

  set funds(value: BigInt) {
    this.set("funds", Value.fromBigInt(value));
  }

  get institution_link(): string {
    let value = this.get("institution_link");
    return value!.toString();
  }

  set institution_link(value: string) {
    this.set("institution_link", Value.fromString(value));
  }

  get pensum_link(): string {
    let value = this.get("pensum_link");
    return value!.toString();
  }

  set pensum_link(value: string) {
    this.set("pensum_link", Value.fromString(value));
  }
}

export class Contribution extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Contribution entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Contribution must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Contribution", id.toString(), this);
    }
  }

  static load(id: string): Contribution | null {
    return changetype<Contribution | null>(store.get("Contribution", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value!.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }

  get to(): string {
    let value = this.get("to");
    return value!.toString();
  }

  set to(value: string) {
    this.set("to", Value.fromString(value));
  }

  get proposal_id(): string {
    let value = this.get("proposal_id");
    return value!.toString();
  }

  set proposal_id(value: string) {
    this.set("proposal_id", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get image(): string {
    let value = this.get("image");
    return value!.toString();
  }

  set image(value: string) {
    this.set("image", Value.fromString(value));
  }
}
