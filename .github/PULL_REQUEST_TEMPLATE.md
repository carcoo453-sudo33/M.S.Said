## Description
Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. Provide a link to the original issue if applicable.

**Example for this refactoring:**
This PR refactors the Portfolio API to implement proper feature separation and clean architecture principles. It separates Comments and Reactions into independent features with their own complete service layers, removes redundant code, and fixes security vulnerabilities.

Fixes # (issue number)

## Type of change
Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (code improvement without changing functionality)
- [ ] This change requires a documentation update (.md files or Swagger)

## Architecture Changes (if applicable)
Describe any significant architectural changes or new patterns introduced.

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes. 
- [ ] Checked for Angular compilation errors (`npm start` or `ng build`)
- [ ] Checked for .NET compilation errors (`dotnet build`)
- [ ] Verified UI responsiveness in Mobile/Desktop views
- [ ] Tested Light/Dark mode and RTL/LTR translations if UI elements were added

## Files Changed
List the main files modified or created (optional but helpful for large PRs).

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings in the console or terminal
- [ ] No duplicate files or code created
- [ ] All files are in the correct location/folder
