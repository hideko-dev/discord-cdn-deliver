import { fontsList } from "../lib/fonts.js";

export function applyFonts() {
    fontsList.forEach(font => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
        @font-face {
          font-family: ${font.name};
          src: url("../../public/fonts/${font.src}");
        }
      `;
        document.head.appendChild(styleElement);
    });
}