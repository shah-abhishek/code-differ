# Taking a Screenshot for the README

To complete your README, you'll need to take a screenshot of your application and save it as `screenshot.png` in the `docs/` folder.

## Steps:

1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Set up an interesting code comparison (maybe some JavaScript vs TypeScript, or before/after refactoring)

4. Take a screenshot of the full application interface

5. Save the screenshot as `docs/screenshot.png`

## Recommended Screenshot Content:

- Show both code panels with different code
- Include the toolbar with language selection and theme toggle
- Show some diff highlighting
- Make sure both panels have meaningful code that demonstrates the tool's capabilities

## Alternative: Use a Screen Capture Tool

You can use tools like:
- **Linux**: `gnome-screenshot`, `scrot`, or `flameshot`
- **Command line**: 
  ```bash
  gnome-screenshot -w -f docs/screenshot.png
  ```

After adding the screenshot, your README will be complete with a visual representation of your code differ tool!