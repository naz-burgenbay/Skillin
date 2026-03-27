using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Skillin.DTOs;
using Skillin.Services;

namespace Skillin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationService _applicationService;

    public ApplicationsController(ApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMine()
    {
        var result = await _applicationService.GetByStudentAsync(GetUserId());
        return Ok(result);
    }

    [HttpGet("listing/{listingId:guid}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetByListing(Guid listingId)
    {
        var result = await _applicationService.GetByListingAsync(listingId, GetUserId());
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Apply([FromBody] CreateApplicationRequest request)
    {
        var result = await _applicationService.ApplyAsync(GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateApplicationStatusRequest request)
    {
        var result = await _applicationService.UpdateStatusAsync(id, GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Withdraw(Guid id)
    {
        var result = await _applicationService.WithdrawAsync(id, GetUserId());
        if (!result.Success) return BadRequest(new { message = result.Message });
        return NoContent();
    }
}