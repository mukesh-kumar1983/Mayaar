using Mayaar.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mayaar.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core database context for Mayaar.
/// </summary>
public sealed class MayaarDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="MayaarDbContext"/> class.
    /// </summary>
    /// <param name="options">The database context options.</param>
    public MayaarDbContext(DbContextOptions<MayaarDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Gets or sets the categories.
    /// </summary>
    public DbSet<Category> Categories => Set<Category>();

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .ValueGeneratedNever();

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Description)
                .HasMaxLength(1000);

            entity.Property(x => x.ImageUrl)
                .HasMaxLength(1000);

            entity.Property(x => x.IsActive)
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .IsRequired();

            entity.Property(x => x.UpdatedAt);
        });
    }
}