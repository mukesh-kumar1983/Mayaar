using Mayaar.Domain.Entities;

namespace Mayaar.Application.Features.Categories;

/// <summary>
/// Provides data access operations for categories.
/// </summary>
public interface ICategoryRepository
{
    /// <summary>
    /// Gets all categories.
    /// </summary>
    Task<IReadOnlyList<Category>> GetAllAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a category by identifier.
    /// </summary>
    Task<Category?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Determines whether a category with the specified name exists.
    /// </summary>
    Task<bool> ExistsByNameAsync(
        string name,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a category.
    /// </summary>
    Task AddAsync(
        Category category,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates a category.
    /// </summary>
    Task UpdateAsync(
        Category category,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a category.
    /// </summary>
    Task DeleteAsync(
        Category category,
        CancellationToken cancellationToken = default);
}