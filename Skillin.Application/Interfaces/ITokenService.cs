using Skillin.Domain.Entities;

namespace Skillin.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}