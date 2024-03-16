# Forms UI kit

#### Компоненты формы (UI kit) на основе:
- фреймворк [Vue 3](https://vuejs.org/) Composition API
- сборщик [Vite](https://vitejs.dev/)
- сторибук [Histoire] (https://histoire.dev/)
- менеджер состояния [XState] (https://xstate.js.org/)
- препроцессор [SCSS] (https://sass-lang.com/)
- тесты [Cypress] (https://www.cypress.io/)

#### Основные особенности:
- Компоненты сделаны на основе [Design System 1.4.1](https://www.figma.com/community/file/1255349027535859598) от [@digitalagencyjp](https://www.figma.com/@digitalagencyjp).
- Форма многошаговая, сохраняет свое состояние после перезагрузки или закрытия.
- Документация по компонентам внутри сторис.

#### Демо:
- [Демо форма](https://sergponomar.github.io/forms-ui-kit/demo/), отправляет запрос на тестовый сервер с mock данными, рандомно отвечает со статусом 200 или 422.
- [Сторис](https://sergponomar.github.io/forms-ui-kit/story/)

##### Установка зависимостей

```bash
yarn
```

##### Компиляция приложения

```bash
# Build demo app
yarn build

# Build stories
yarn story:build
```

После установки зависимостей и запуска сборки в папках dist и .histoire/dist появятся итоговые файлы приложения<br>

##### Запуск приложения в режиме разработки

```bash
# Start demo app with multi step form
yarn dev

# Start histoire app
yarn story:dev
```

##### Запуск тестов

```bash
yarn test
```

##### Запуск статического анализа

```bash
yarn lint
```
