# relaxql

**Auto-generate and manage Sequelize relationships with ease**

---

## What is relaxql?

`relaxql` is a lightweight helper library for Sequelize ORM that simplifies defining model relationships.  
Instead of writing repetitive association code on both sides, you define just one side — and `relaxql` automatically creates the inverse association for you.

---

## Features

- Define relationships with minimal config
- Automatically creates inverse relations (`hasMany` ↔ `belongsTo`, etc.)
- Supports all Sequelize association types:
    - `hasOne`
    - `hasMany`
    - `belongsTo`
    - `belongsToMany`
- Pass Sequelize options like `onDelete`, `hooks`, and more
- Optionally disable automatic inverse creation if needed

---

## Installation

```bash
npm i @usmantariqdev/relaxql
