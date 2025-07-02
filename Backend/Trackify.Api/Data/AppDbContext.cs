using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Trackify.Api.Models;

namespace Trackify.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TrackifyUsers> TrackifyUsers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Expense> Expenses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply entity configurations
            modelBuilder.ApplyConfiguration(new AssetConfiguration());

            // modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
        }

    }


    public class AssetConfiguration : IEntityTypeConfiguration<Asset>
    {
        public void Configure(EntityTypeBuilder<Asset> builder)
        {
            builder.HasOne(a => a.AssignedEmployee)
                   .WithMany()
                   .HasForeignKey(a => a.AssignedToEmployeeId)
                   .HasPrincipalKey(e => e.Id)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }

}
