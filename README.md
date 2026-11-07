# Dating Plan 💌🎄

An interactive, Christmas-themed date proposal website. The "No" button playfully
runs away from the cursor so it cannot be clicked, while the "Yes" button reveals
a personalized Christmas date plan.

## Features

- Romantic glassmorphism proposal card with floating hearts.
- A "No" button that dodges the mouse, touch, and keyboard focus.
- Celebration screen with confetti and falling snow.
- Christmas-themed date plan (liquid glass style) with side-by-side trees.
- Interactive choices for **drink**, **food**, and **other treat**.
- The selected answers are reflected in the date plan and in a live summary.
- Responsive layout for desktop and mobile.

## How to Run

No installation or build step is required.

1. Open the `Dating_Plan` folder.
2. Double-click `index.html` (or open it in any modern browser).

## Project Structure

```
Dating_Plan/
├── index.html   # Page markup
├── style.css    # All styles, animations, and themes
├── script.js    # All behavior and interactivity
└── README.md    # Project documentation
```

## Programming Languages and Technologies

| Language / Technology | Role |
| --------------------- | ---- |
| **HTML5**             | Page structure and content |
| **CSS3**              | Layout, animations, glassmorphism, Christmas theme |
| **JavaScript**        | Dodging "No" button, date plan logic, choices, confetti, snow (`script.js`) |

> **Note:** The scripting language used here is **JavaScript**, not Java.
> This project does not use the Java programming language or a Java runtime.

## Customization

- **Question and subtitle:** edit the `<h1 id="question">` and `.subtitle` text in `index.html`.
- **No button messages:** edit the `noTexts` and `teases` arrays in `script.js`.
- **Date plan:** edit the `.plan-item` blocks (time, title, and description) in `index.html`.
- **Choices:** edit the `.choice-list` groups in `index.html` and the `data-value` / `data-emoji`
  attributes of the `.chip` buttons.
- **Colors and theme:** edit the gradients and rules in `style.css`.

## Browser Support

Works best in current versions of Chrome, Edge, Firefox, and Safari.
`backdrop-filter` (the glass effect) requires a modern browser.

## License

Free to use and personalize for your own date invitation.
