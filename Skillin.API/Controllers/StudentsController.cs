using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Services;

namespace Skillin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly StudentService _studentService;

    public StudentsController(StudentService studentService)
    {
        _studentService = studentService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _studentService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _studentService.GetByIdAsync(id);
        if (result is null) return NotFound(new { message = "Profil tapılmadı." });
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMine()
    {
        var result = await _studentService.GetByUserIdAsync(GetUserId());
        if (result is null) return NotFound(new { message = "Profil tapılmadı." });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create([FromBody] CreateStudentProfileRequest request)
    {
        var result = await _studentService.CreateAsync(GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStudentProfileRequest request)
    {
        var result = await _studentService.UpdateAsync(id, GetUserId(), request);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(result.Data);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _studentService.DeleteAsync(id, GetUserId());
        if (!result.Success) return BadRequest(new { message = result.Message });
        return NoContent();
    }
}