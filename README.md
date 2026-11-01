# DotnetReactCrud

A full-stack CRUD app for managing a simple directory of people, built with an ASP.NET Core Web API and a React client.

## Tech stack

**Backend:** ASP.NET Core (.NET 10), Entity Framework Core, SQLite

**Frontend:** React 19, Vite, React Router, Zustand, Axios, Tailwind CSS 4, Sonner, lucide-react

## Project structure

```
Backend/            .NET solution
  Backend/          Web API project (controllers, models, EF Core migrations, Person.db)
client/             React + Vite frontend
project-instructions.md   Step-by-step log of how the project was built
```

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS)

### 1. Run the API

```bash
cd Backend/Backend
dotnet run
```

The API listens on `http://localhost:3000`. To recreate the database from the migrations:

```bash
dotnet tool install --global dotnet-ef   # once
dotnet ef database update
```

### 2. Run the client

Create `client/.env`:

```
VITE_BASE_API_URL=http://localhost:3000/api
```

Then:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The API's CORS policy allows this origin.

## API

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/people`       | List all people   |
| GET    | `/api/people/{id}`  | Get one person    |
| POST   | `/api/people`       | Create a person   |
| PUT    | `/api/people/{id}`  | Update a person   |
| DELETE | `/api/people/{id}`  | Delete a person   |

A person has a `firstName` and a `lastName`. Both are required and limited to 30 characters. You can try the endpoints with [Backend/Backend/person.http](Backend/Backend/person.http).

## How it was built

See [project-instructions.md](project-instructions.md) for the full step-by-step development process.
