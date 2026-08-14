using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mayaar.Infrastructure.Persistence;

namespace Mayaar.Api.Controllers;

/// <summary>
/// Provides application health endpoints.
/// </summary>
[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    private readonly MayaarDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="HealthController"/> class.
    /// </summary>
    /// <param name="dbContext">The Mayaar database context.</param>
    public HealthController(MayaarDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Verifies that the application can connect to PostgreSQL.
    /// </summary>
    /// <returns>The database connection status.</returns>
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var canConnect = await _dbContext.Database.CanConnectAsync(cancellationToken);

        return Ok(new
        {
            status = canConnect ? "Healthy" : "Unhealthy",
            database = "PostgreSQL"
        });
    }
}