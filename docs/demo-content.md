# 📸 Screenshot Instructions

## Quick Setup for Demo Screenshot

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open in browser:** `http://localhost:5173`

3. **Set up demo content:**
   
   **Left Panel (Original):**
   ```javascript
   // Original function
   function calculateTotal(items) {
     let total = 0;
     for (let i = 0; i < items.length; i++) {
       total += items[i].price;
     }
     return total;
   }
   ```

   **Right Panel (Refactored):**
   ```javascript
   // Refactored with modern JS
   const calculateTotal = (items) => {
     return items.reduce((total, item) => total + item.price, 0);
   };
   
   // Added validation
   const calculateTotalSafe = (items = []) => {
     if (!Array.isArray(items)) return 0;
     return items.reduce((total, item) => {
       return total + (item?.price || 0);
     }, 0);
   };
   ```

4. **Configure settings:**
   - Language: JavaScript
   - Theme: Dark (looks professional)
   - View: Side-by-side

5. **Take screenshot:**
   - Capture the full interface
   - Include toolbar, both code panels, and stats
   - Save as `docs/screenshot.png`

## Alternative Content Ideas

- **TypeScript vs JavaScript conversion**
- **Before/after code optimization** 
- **API response comparison (JSON)**
- **Configuration file changes**

The goal is to show the tool's diff highlighting and professional interface!