using Skillin.Domain.Entities;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Data;
using Skillin.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
namespace Skillin.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthService(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<(bool Success, string Message, AuthResponse? Data)> RegisterAsync(RegisterRequest request)
    {
        var exists = await _context.Users
            .AnyAsync(u => u.Email == request.Email.ToLower());

        if (exists)
            return (false, "Email is already registered.", null);

        var user = new User
        {
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);

        return (true, "Registration successful.", new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role.ToString(),
            UserId = user.Id
        });
    }

    public async Task<(bool Success, string Message, AuthResponse? Data)> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return (false, "Invalid email or password.", null);

        var token = _tokenService.GenerateToken(user);

        return (true, "Login successful.", new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role.ToString(),
            UserId = user.Id
        });
    }
}