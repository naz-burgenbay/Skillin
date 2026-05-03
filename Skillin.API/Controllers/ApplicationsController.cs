using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Services;

namespace Skillin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationService _applicationService;
    private readonly IWebHostEnvironment _env;

    public ApplicationsController(ApplicationService applicationService, IWebHostEnvironment env)
    {
        _applicationService = applicationService;
        _env = env;
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

    [HttpGet]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _applicationService.GetByCompanyAsync(GetUserId());
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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Apply([FromForm] Guid listingId, [FromForm] string coverLetter, IFormFile? cv)
    {
        string? cvPath = null;

        if (cv != null)
        {
            var allowed = new[] { ".pdf", ".doc", ".docx" };
            var ext = Path.GetExtension(cv.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                return BadRequest(new { message = "CV must be a PDF, DOC, or DOCX file." });

            if (cv.Length > 10 * 1024 * 1024)
                return BadRequest(new { message = "CV file must be smaller than 10 MB." });

            var uploadsDir = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "uploads", "cvs");
            Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using var stream = System.IO.File.Create(filePath);
            await cv.CopyToAsync(stream);

            cvPath = Path.Combine("uploads", "cvs", fileName);
        }

        var request = new CreateApplicationRequest { ListingId = listingId, CoverLetter = coverLetter ?? string.Empty };
        var result = await _applicationService.ApplyAsync(GetUserId(), request, cvPath);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Student")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(Guid id, [FromForm] string coverLetter, IFormFile? cv)
    {
        string? cvPath = null;

        if (cv != null)
        {
            var allowed = new[] { ".pdf", ".doc", ".docx" };
            var ext = Path.GetExtension(cv.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                return BadRequest(new { message = "CV must be a PDF, DOC, or DOCX file." });

            if (cv.Length > 10 * 1024 * 1024)
                return BadRequest(new { message = "CV file must be smaller than 10 MB." });

            var uploadsDir = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "uploads", "cvs");
            Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using var stream = System.IO.File.Create(filePath);
            await cv.CopyToAsync(stream);

            cvPath = Path.Combine("uploads", "cvs", fileName);
        }

        var request = new UpdateApplicationRequest { CoverLetter = coverLetter ?? string.Empty };
        var result = await _applicationService.UpdateAsync(id, GetUserId(), request, cvPath);
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