namespace Mayaar.Application.Features.Categories;

/// <summary>
/// Represents a request to create a category.
/// </summary>
public sealed class CreateCategoryRequest
{
    /// <summary>
    /// Gets or sets the category name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the category description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the category image URL.
    /// </summary>
    public string? ImageUrl { get; set; }
}