using Backend.Models;
using Microsoft.EntityFrameworkCore;

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

// Services
builder.Services.AddControllers();

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("ConnectionString is null");

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);
// Middleware
app.MapControllers();

app.Run();
