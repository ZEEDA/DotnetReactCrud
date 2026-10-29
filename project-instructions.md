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
