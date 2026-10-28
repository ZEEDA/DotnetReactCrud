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
