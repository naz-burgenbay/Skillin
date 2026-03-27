using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Skillin.DTOs;
using Skillin.Services;

namespace Skillin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly ListingService _listingService;

    public ListingsController(ListingService listingService)
    {
        _listingService = listingService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null)
    {
        var result = await _listingService.GetAllAsync(search);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _listingService.GetByIdAsync(id);
        if (result is null) return NotFound(new { message = "Elan tapılmadı." });
        return Ok(result);
    }

    [HttpGet("company/{companyProfileId:guid}")]
    public async Task<IActionResult> GetByCompany(Guid companyProfileId)
    {
        var result = await _listingService.GetByCompanyAsync(companyProfileId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> Create([FromBody] CreateListingRequest request)
    {
        var result = await _listingService.CreateAsync(GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateListingRequest request)
    {
        var result = await _listingService.UpdateAsync(id, GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _listingService.DeleteAsync(id, GetUserId());
        if (!result.Success) return BadRequest(new { message = result.Message });
        return NoContent();
    }
}