namespace Portfolio.API.Domain.Enums;

public enum ProjectType
{
    Initial,    // Brand new project from scratch
    Editing,    // Modifying existing project
    Fixing,     // Bug fixing or maintenance
    Refactoring, // Code restructuring without new features
    Migration,  // Migrating to new technology
    Enhancement, // Adding new features to existing project
    Integration, // Integrating with other systems
    Performance, // Performance optimization
    Security,   // Security improvements
    Documentation // Documentation updates
}
