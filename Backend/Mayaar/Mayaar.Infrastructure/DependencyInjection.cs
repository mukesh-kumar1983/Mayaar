using Mayaar.Application.Features.Categories;
using Mayaar.Infrastructure.Persistence;
using Mayaar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Mayaar.Infrastructure;

/// <summary>
/// Provides dependency injection configuration for the infrastructure layer.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Mayaar infrastructure services.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">The application configuration.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MayaarDatabase")
            ?? throw new InvalidOperationException(
                "The 'MayaarDatabase' connection string is not configured.");

        services.AddDbContext<MayaarDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<ICategoryRepository, CategoryRepository>();

        return services;
    }
}