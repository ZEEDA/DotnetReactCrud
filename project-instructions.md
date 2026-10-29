# DotnetReactCrud – Development Process

A step-by-step log of how this project was built, so others can follow along and reproduce it.

---

## 1. Create the Project

### 1.1 Create a new solution

```bash
dotnet new sln -o Backend
cd Backend
```

### 1.2 Create the Web API project and add it to the solution

```bash
dotnet new web -o Backend
dotnet sln add Backend/Backend.csproj
```

### 1.3 Add a `.gitignore` at the repository root

```bash
cd ../
dotnet new gitignore
```

### 1.4 Initialize Git and make the first commit

```bash
git init
git add .
git commit -m "Initial commit"
```

---

## 2. Configure the Application

### 2.1 Change the development port

**File edited:** `Backend/Backend/Properties/launchSettings.json`

Change the HTTP port from the generated random port (`5112`) to `3000` in both the `http` and `https` profiles:

```json
"http": {
  "commandName": "Project",
  "dotnetRunMessages": true,
  "launchBrowser": true,
  "applicationUrl": "http://localhost:3000",
  "environmentVariables": {
    "ASPNETCORE_ENVIRONMENT": "Development"
  }
},
"https": {
  "commandName": "Project",
  "dotnetRunMessages": true,
  "launchBrowser": true,
  "applicationUrl": "https://localhost:7146;http://localhost:3000",
  "environmentVariables": {
    "ASPNETCORE_ENVIRONMENT": "Development"
  }
}
```

### 2.2 Switch from Minimal APIs to Controllers

**File edited:** `Backend/Backend/Program.cs`

- Register controller services with `AddControllers()`.
- Remove the default `"Hello World!"` endpoint.
- Map controller routes with `MapControllers()`.

```csharp
var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
var app = builder.Build();

// Middleware
app.MapControllers();

app.Run();
```

---

## 3. Add the Data Model

### 3.1 Create the `Person` model

**File added:** `Backend/Backend/Models/Person.cs`

Create a `Models` folder and add the `Person` entity. Data annotations enforce validation:
- `[Required]` – the field must be provided.
- `[MaxLength(30)]` – limits the string length to 30 characters.

```csharp
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Person
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string LastName { get; set; } = string.Empty;
}
```

---

## 4. Add the API Controller

### 4.1 Create the `PeopleController`

**File added:** `Backend/Backend/Controllers/PeopleController.cs`

Create a `Controllers` folder and add an empty API controller. CRUD actions will be added to it in later steps.
- `[Route("api/[controller]")]` – routes requests to `/api/people`.
- `[ApiController]` – enables automatic model validation and API-specific behaviors.
- `ControllerBase` – base class for API controllers (no view support).

```csharp
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PeopleController : ControllerBase
{
}
```

### 4.2 Run the application

```bash
cd Backend/Backend
dotnet run
```

The API is now listening on `http://localhost:3000`.

---

## 5. Add the Database with Entity Framework Core (SQLite)

### 5.1 Install the EF Core NuGet packages

**File edited:** `Backend/Backend/Backend.csproj`

From the `Backend/Backend` folder, add the SQLite provider and the design-time package (needed for migrations):

```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
```

This adds the following references to the project file:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.14">
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    <PrivateAssets>all</PrivateAssets>
  </PackageReference>
  <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="10.0.14" />
</ItemGroup>
```

### 5.2 Add the connection string

**Files edited:** `Backend/Backend/appsettings.json` and `Backend/Backend/appsettings.Development.json`

Add a `ConnectionStrings` section at the top of both files. SQLite stores the whole database in a single file, here `Person.db`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=Person.db"
},
```

### 5.3 Create the database context

**File added:** `Backend/Backend/Models/AppDbContext.cs`

The `DbContext` is the bridge between the C# models and the database. Each `DbSet<T>` property becomes a table, so `People` maps to a `People` table of `Person` rows.

```csharp
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Person> People { get; set; }
}
```

### 5.4 Register the database context

**File edited:** `Backend/Backend/Program.cs`

Read the connection string from configuration (fail fast if it is missing), then register `AppDbContext` with dependency injection so controllers can receive it in their constructors:

```csharp
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("ConnectionString is null");

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

var app = builder.Build();

// Middleware
app.MapControllers();

app.Run();
```

### 5.5 Install the EF Core CLI tool (once per machine)

```bash
dotnet tool install --global dotnet-ef
```

### 5.6 Create the first migration

**Files added:** `Backend/Backend/Migrations/`
- `<timestamp>_InitialCreate.cs` – the `Up()` method creates the `People` table and `Down()` drops it.
- `<timestamp>_InitialCreate.Designer.cs` – migration metadata (auto-generated).
- `AppDbContextModelSnapshot.cs` – a snapshot of the current model, used to work out the next migration.

```bash
dotnet ef migrations add InitialCreate
```

The generated table follows the model's annotations: `Id` becomes an auto-increment primary key, and `FirstName`/`LastName` become required `TEXT` columns with a max length of 30.

### 5.7 Apply the migration to create the database

**File added:** `Backend/Backend/Person.db`

```bash
dotnet ef database update
```

This creates the `Person.db` SQLite file with the `People` table. Do not edit the migration files by hand. When the model changes, add a new migration and run `database update` again.

---

## 6. Implement the CRUD Endpoints

**File edited:** `Backend/Backend/Controllers/PeopleController.cs`

### 6.1 Plan the routes

| Method | Route              | Body     | Action                |
|--------|--------------------|----------|-----------------------|
| POST   | `/api/people`      | `Person` | Create a person       |
| GET    | `/api/people`      | –        | List all people       |
| GET    | `/api/people/{id}` | –        | Get one person by id  |
| PUT    | `/api/people/{id}` | `Person` | Update a person       |
| DELETE | `/api/people/{id}` | –        | Delete a person       |

### 6.2 Inject the database context

Ask for `AppDbContext` in the constructor. The DI container supplies it because it was registered in step 5.4.

```csharp
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PeopleController : ControllerBase
{
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }
}
```

Every action below follows the same pattern: do the work inside `try`, and on any exception return `500 Internal Server Error` with the exception message.

### 6.3 Create – `POST /api/people`

Add the person, save, then return `201 Created` with a `Location` header pointing to the new resource. `CreatedAtRoute` builds that URL from the route named `"GetPerson"` (defined in 6.5).

```csharp
[HttpPost]
public async Task<IActionResult> AddPerson(Person person)
{
    try
    {
        _context.People.Add(person);
        await _context.SaveChangesAsync();
        return CreatedAtRoute("GetPerson", new { id = person.Id }, person);
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
    }
}
```

### 6.4 Read all – `GET /api/people`

```csharp
[HttpGet]
public async Task<IActionResult> GetPeople()
{
    try
    {
        var people = await _context.People.ToListAsync();
        return Ok(people);
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
    }
}
```

### 6.5 Read one – `GET /api/people/{id}`

- `{id:int}` is a route constraint, so only integer ids match.
- `Name = "GetPerson"` names the route so `CreatedAtRoute` in 6.3 can link to it.
- Return `404 Not Found` when no row has that id.

```csharp
[HttpGet("{id:int}", Name = "GetPerson")]
public async Task<IActionResult> GetPerson(int id)
{
    try
    {
        var person = await _context.People.FindAsync(id);
        if (person is null)
        {
            return NotFound();
        }
        return Ok(person);
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
    }
}
```

### 6.6 Update – `PUT /api/people/{id}`

1. Return `400 Bad Request` if the id in the URL differs from the id in the body.
2. Return `404 Not Found` if the person does not exist.
3. Otherwise update, save, and return `204 No Content`.

```csharp
[HttpPut("{id:int}")]
public async Task<IActionResult> UpdatePerson(int id, [FromBody] Person person)
{
    try
    {
        if (id != person.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the body.");
        }

        if (!await _context.People.AnyAsync(p => p.Id == id))
        {
            return NotFound();
        }

        _context.People.Update(person);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
    }
}
```

### 6.7 Delete – `DELETE /api/people/{id}`

Find the person, return `404` if missing, otherwise remove, save, and return `204 No Content`.

```csharp
[HttpDelete("{id:int}")]
public async Task<IActionResult> DeletePerson(int id)
{
    try
    {
        var person = await _context.People.FindAsync(id);

        if (person is null)
        {
            return NotFound();
        }

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
    }
}
```

---

## 7. Test the API with an `.http` File

**File added:** `Backend/Backend/person.http`

### 7.1 Write the requests

An `.http` file lets you send requests straight from the editor (VS Code REST Client extension or Visual Studio). Requests are separated by `###`.

```http
@base_address = http://localhost:3000/api/people

POST {{base_address}}
Content-Type: application/json

{
    "firstName": "Joana",
    "lastName": "Doe"
}

###
GET {{base_address}}

###
GET {{base_address}}/1

###
PUT {{base_address}}/4
Content-Type: application/json

{
    "id": 4,
    "firstName": "Mahmoud",
    "lastName": "Ali"
}

###
DELETE {{base_address}}/2
```

### 7.2 Send the requests

1. Start the API: `dotnet run` from `Backend/Backend`.
2. Click **Send Request** above each request in the `.http` file.
3. Check the status codes: `201` for POST, `200` for GET, `204` for PUT and DELETE, and `404` for an id that does not exist.

### 7.3 Common mistakes that cause `400 Bad Request`

With `[ApiController]`, a body that can't be parsed or fails validation is rejected with `400` **before** the action runs, so no breakpoint inside the action is hit.

- **Trailing comma in JSON.** `"lastName": "Doe",` before `}` is invalid JSON, and System.Text.Json rejects it.
- **Wrong variable syntax.** Declare a variable with `@name = value` and use it as `{{name}}`. Writing `{{@name}}` does not work.
- **Missing required fields.** Leaving out `firstName` or `lastName`, or using more than 30 characters, fails the `[Required]`/`[MaxLength(30)]` validation.
- **Missing header.** Requests with a body need `Content-Type: application/json`.

Read the response body. It is a `ValidationProblem` JSON object that names the field and the error.

---

## 8. Enable CORS for the React Frontend

**File edited:** `Backend/Backend/Program.cs`

The React dev server (Vite) runs on `http://localhost:5173`, which is a different origin from the API on port `3000`. Browsers block those cross-origin requests unless the API allows them through CORS.

### 8.1 Define a named CORS policy

Allow the frontend origin with any HTTP method and header:

```csharp
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader();
        }
    );
});
```

### 8.2 Apply the policy in the pipeline

Call `UseCors` after `Build()` and **before** `MapControllers()`, so the CORS headers are added to controller responses:

```csharp
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

// Middleware
app.MapControllers();

app.Run();
```

CORS only applies to browsers. Requests from the `.http` file or tools like Postman work either way.
