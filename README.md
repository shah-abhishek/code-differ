# Code Differ 🔍

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white)](https://microsoft.github.io/monaco-editor/)

A powerful, web-based code comparison tool built with React, TypeScript, and Monaco Editor. Compare code side-by-side with syntax highlighting, diff visualization, and comprehensive analysis features.

![Code Differ Screenshot](./docs/screenshot.png)

> **Note**: Add a screenshot of your application by running `npm run dev`, opening `http://localhost:5173` in your browser, and taking a screenshot. Save it as `docs/screenshot.png` to complete the visual documentation.

## ✨ Features

- **Side-by-Side Comparison**: Compare two code snippets with intuitive side-by-side view
- **Syntax Highlighting**: Support for multiple programming languages including:
  - TypeScript/JavaScript
  - JSX/TSX
  - Python
  - Java
  - C#
  - HTML/CSS
  - JSON/XML
  - And more!
- **Multiple View Modes**: Switch between side-by-side and inline diff views
- **File Upload**: Drag and drop or select files to compare
- **Real-time Statistics**: View insertions, deletions, and change metrics
- **Monaco Editor Integration**: Powered by VS Code's editor for the best coding experience
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Word Wrap**: Toggle word wrap for better readability
- **Customizable Options**: Various settings to tailor the comparison experience

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shah-abhishek/code-differ.git
cd code-differ
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🏗️ Built With

- **[React 19](https://react.dev/)** - UI Framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type Safety
- **[Vite](https://vitejs.dev/)** - Build Tool
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Code Editor
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[diff-match-patch](https://github.com/google/diff-match-patch)** - Diff Algorithm

## 📁 Project Structure

```
code-differ/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MainContent.tsx
│   │   └── Sidebar.tsx
│   ├── layouts/
│   │   └── AppLayout.tsx
│   ├── pages/
│   │   ├── DiffTool.tsx
│   │   └── Home.tsx
│   ├── types/
│   │   └── diff-match-patch.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docs/
├── package.json
└── README.md
```

## 🎯 Usage

1. **Load Code**: 
   - Type or paste code directly into the left and right panels
   - Use the file upload buttons to load files from your computer
   - Drag and drop files onto the panels

2. **Select Language**: 
   - Choose the appropriate programming language from the dropdown
   - Automatic language detection based on file extensions

3. **Customize View**:
   - Toggle between side-by-side and inline diff modes
   - Switch between light and dark themes
   - Enable/disable word wrap
   - Configure whitespace handling

4. **Analyze Differences**:
   - View real-time statistics showing insertions, deletions, and changes
   - Navigate through changes using the diff markers
   - Export or share your comparisons

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Monaco Editor team for the excellent code editor
- Google's diff-match-patch library for the diff algorithm
- React and Vite teams for the excellent development tools

## 📧 Contact

**Abhishek Shah** - [@shah-abhishek](https://github.com/shah-abhishek)

Project Link: [https://github.com/shah-abhishek/code-differ](https://github.com/shah-abhishek/code-differ)

---

⭐️ If you find this project useful, please consider giving it a star!
