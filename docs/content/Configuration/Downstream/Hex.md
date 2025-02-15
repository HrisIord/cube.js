---
title: Connecting to Hex
permalink: /config/downstream/hex
---

You can connect to Cube from Hex, a collaborative data platform, using the [Cube SQL
API][ref-sql-api].

## Enable Cube SQL API

<InfoBox>

Don't have a Cube project yet? [Learn how to get started
here][ref-getting-started].

</InfoBox>

### Cube Cloud

Click **How to connect your BI tool** link on the Overview page, navigate to the SQL API tab
and enable it. Once enabled, you should see the screen like the one below with
your connection credentials:

<div style="text-align: center">
  <img
    src="https://raw.githubusercontent.com/cube-js/cube.js/master/docs/content/cube-sql-api-modal.png"
    style="border: none"
    width="80%"
  />
</div>

### Self-hosted Cube

You need to set the following environment variables to enable the Cube SQL API.
These credentials will be required to connect to Cube from Apache Superset
later.

```dotenv
CUBEJS_PG_SQL_PORT=5432
CUBE_SQL_USERNAME=myusername
CUBE_SQL_PASSWORD=mypassword
```
## Connecting from Hex

Hex connects to Cube as to a Postgres database.

## Querying data

Your cubes will be exposed as tables, where both your measures and dimensions are columns.

You can write SQL in Hex that will be executed in Cube. Learn more about Cube SQL
syntax on the [reference page][ref-sql-api].

<div style="text-align: center">
  <img
    src="https://raw.githubusercontent.com/cube-js/cube.js/master/docs/content/Configuration/Downstream/hex-1.png"
    style="border: none"
    width="80%"
  />
</div>

You can also create a visualization of the executed SQL query.

<div style="text-align: center">
  <img
    src="https://raw.githubusercontent.com/cube-js/cube.js/master/docs/content/Configuration/Downstream/hex-2.png"
    style="border: none"
    width="80%"
  />
</div>

[ref-getting-started]: /cloud/getting-started
[ref-sql-api]: /backend/sql
