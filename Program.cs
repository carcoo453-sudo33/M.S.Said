@using Microsoft.AspNetCore.SignalR
builder.Services.AddCors(o => o.AddPolicy("A", p => p.SetIsOriginAllowed(_ => true).AllowCredentials().AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build(); app.UseRouting(); app.UseCors("A"); app.MapHub<MyHub>("/h").RequireCors("A"); app.Run();
public class MyHub : Hub {}
