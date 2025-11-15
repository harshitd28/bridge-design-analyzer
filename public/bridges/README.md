# Bridge Images Directory

Place your bridge design images in this folder with the following exact file names:

## Required Image Files:

1. **suspension-bridge.jpg** - Image for Suspension Bridge design
2. **arch-bridge.jpg** - Image for Arch Bridge design
3. **cable-stayed-bridge.jpg** - Image for Cable-Stayed Bridge design
4. **beam-bridge.jpg** - Image for Beam Bridge design
5. **truss-bridge.jpg** - Image for Truss Bridge design

## File Format:
- **Format**: JPG, JPEG, PNG, or WebP
- **Recommended size**: 800x600px or larger
- **File names**: Must match exactly (case-sensitive)

## Example:
```
public/
  bridges/
    suspension-bridge.jpg
    arch-bridge.jpg
    cable-stayed-bridge.jpg
    beam-bridge.jpg
    truss-bridge.jpg
```

## Notes:
- Images will be automatically loaded from this directory
- If an image is missing, the system will fallback to a default Unsplash image
- After adding images, restart the dev server: `npm run dev`

