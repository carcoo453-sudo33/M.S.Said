#!/bin/bash

# Bash script to commit and push changes to GitHub asynchronously
echo -e "\033[0;32mStarting Git operations...\033[0m"

# Stage all changes
echo -e "\n\033[0;33mStaging all changes...\033[0m"
git add -A

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "\033[0;31mNo changes to commit.\033[0m"
    exit 0
fi

# Commit changes
echo -e "\n\033[0;33mCommitting changes...\033[0m"
git commit -m "feat: Add education image lightbox and fix skeleton component warnings

- Add lightbox functionality to education timeline images
  * Click on education card images to open full-screen lightbox
  * Navigation with arrow buttons and keyboard (Arrow keys, Escape)
  * Image counter and thumbnail strip for multiple images
  * Two close buttons (white and red) matching project details style
  * Smooth animations (fadeIn, scaleIn, slideLeft, slideRight)
  * RTL support for Arabic layout

- Fix Angular build warnings for unused skeleton components
  * Remove unused ProjectsHeaderComponent and ProjectsHeaderSkeletonComponent
  * Projects page now uses SharedPageHeaderComponent consistently
  * Delete obsolete header component files
  * All skeleton components now properly matched to templates

- Clean up temporary files
  * Remove unused component imports
  * Verify all main components have no diagnostics"

if [ $? -ne 0 ]; then
    echo -e "\033[0;31mCommit failed!\033[0m"
    exit 1
fi

# Push to GitHub
echo -e "\n\033[0;33mPushing to GitHub...\033[0m"
git push

if [ $? -eq 0 ]; then
    echo -e "\n\033[0;32m✓ Successfully pushed to GitHub!\033[0m"
else
    echo -e "\n\033[0;31m✗ Push failed! Please check your connection and credentials.\033[0m"
    exit 1
fi

echo -e "\n\033[0;32mAll operations completed successfully!\033[0m"
