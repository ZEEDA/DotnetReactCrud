var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
var app = builder.Build();

// Middleware
app.MapControllers();

app.Run();
