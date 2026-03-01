// для CSS-модулей вида *.module.scss
declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

// для глобальных импорта вида `import "./globals.scss"`
declare module '*.scss';
declare module '*.css';
