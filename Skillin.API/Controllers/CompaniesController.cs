using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Skillin.Application.DTOs;
using Skillin.Services;

namespace Skillin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly CompanyService _companyService;

    public CompaniesController(CompanyService companyService)
    {
        _companyService = companyService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _companyService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _companyService.GetByIdAsync(id);
        if (result is null) return NotFound(new { message = "Profil tapılmadı." });
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMine()
    {
        var result = await _companyService.GetByUserIdAsync(GetUserId());
        if (result is null) return NotFound(new { message = "Profil tapılmadı." });
        return Ok(result);
    }

    [HttpPut("me")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateMine([FromBody] UpdateCompanyProfileRequest request)
    {
        var result = await _companyService.UpdateByUserIdAsync(GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> Create([FromBody] CreateCompanyProfileRequest request)
    {
        var result = await _companyService.CreateAsync(GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCompanyProfileRequest request)
    {
        var result = await _companyService.UpdateAsync(id, GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _companyService.DeleteAsync(id, GetUserId());
        if (!result.Success) return BadRequest(new { message = result.Message });
        return NoContent();
    }
}