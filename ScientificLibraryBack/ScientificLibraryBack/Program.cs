using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.AdminService;
using ScientificLibraryBack.Services.AuthService;
using ScientificLibraryBack.Services.BookService;
using ScientificLibraryBack.Services.EmailService;
using ScientificLibraryBack.Services.EmailService.Models;
using ScientificLibraryBack.Services.PublisherService;
using ScientificLibraryBack.Services.UserService;

using System.Data;
using System.Security.Claims;
using System.Text;
using User.Management.Service.Services;

var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//{
//    options.UseSqlServer(builder.Configuration.GetSection("ConnectionStrings:LibDB").Value);
//});


var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbPassword = Environment.GetEnvironmentVariable("DB_SA_PASSWORD");
var connectionString = $"Data Source={dbHost};Initial Catalog={dbName};User ID=sa;Password={dbPassword};Encrypt=False;MultipleActiveResultSets=true;";
builder.Services.AddDbContext<ApplicationDbContext>(opt => opt.UseSqlServer(connectionString));

builder.Services.AddIdentity<ExtendedIdentityUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 5;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();


//Config for Email
builder.Services.Configure<IdentityOptions>(options => options.SignIn.RequireConfirmedEmail = true);
builder.Services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromHours(10));

var emailConfig = builder.Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();
builder.Services.AddSingleton(emailConfig);
builder.Services.AddScoped<IEmailService, EmailService>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        RequireExpirationTime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration.GetSection("JWT:Issuer").Value,
        ValidAudience = builder.Configuration.GetSection("JWT:Audience").Value,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT:Key").Value)),
        RoleClaimType = ClaimTypes.Role // Make sure this is set correctly for role validation
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:5173") // React app's origin
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IBookService, BookService>();
builder.Services.AddScoped<IReaderService, ReaderService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IPublisherService, PublisherService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//app.MapIdentityApi<IdentityUser>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!builder.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication(); // Make sure this is enabled
app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    var roles = new[] { "Admin", "Publisher", "Reader" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }
}

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ExtendedIdentityUser>>();

    string email = "admin@admin.com";
    string password = "Test123!@#";

    if (await userManager.FindByEmailAsync(email) == null)
    {
        var user = new ExtendedIdentityUser();
        user.Type = UserType.Admin;
        user.Email = email;
        user.UserName = email;
        user.EmailConfirmed = true;
        await userManager.CreateAsync(user, password);
        await userManager.AddToRoleAsync(user, "Admin");
    }
}

app.UseCors("AllowReactApp");
app.Run();
