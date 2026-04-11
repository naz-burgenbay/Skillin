namespace Skillin.Application.DTOs;

public class CreateStudentProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
}

public class UpdateStudentProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;

}

public class StudentProfileResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

