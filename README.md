# Kotlin Tools for VS Code

[![Version](https://img.shields.io/visual-studio-marketplace/v/hiveMC.kotlin-tools)](https://marketplace.visualstudio.com/items?itemName=hiveMC.kotlin-tools)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/hiveMC.kotlin-tools)](https://marketplace.visualstudio.com/items?itemName=hiveMC.kotlin-tools)

Минималистичный набор инструментов для работы с Kotlin в VS Code.

## Особенности

- 🚀 Создание шаблона Kotlin-проекта
- ▶️ Запуск кода через встроенный терминал
- ✅ Автоматическая проверка зависимостей
- 📂 Генерация структуры проекта:

/src
/main/kotlin
/test/kotlin
/out
/lib

## Установка

1. Откройте **Extensions** в VS Code (`Ctrl+Shift+X`)
2. Найдите `Kotlin Tools`
3. Нажмите **Install**

## Использование

### Создание проекта

1. Откройте палитру команд (`Ctrl+Shift+P`)
2. Выберите `Kotlin: Create Project`
3. Введите имя проекта
4. Выберите папку для сохранения

### Запуск кода

1. Откройте файл `.kt`
2. Нажмите кнопку ▶️ в панели редактора
3. Или выполните команду `Kotlin: Run`

## Требования

- Kotlin ≥ 1.8.20
- Java Runtime Environment (JRE) 11+
- Настройте путь к Kotlin в настройках VS Code

## Конфигурация

Добавьте путь к Kotlin в `settings.json`:

```json
{
	"kotlin-tools.kotlinPath": "C:/kotlin" // или /usr/local/bin/kotlin
}
```

FAQ
❌ "Kotlin dependencies are missing!"

    Убедитесь, что Kotlin установлен

    Проверьте путь в настройках

    Перезапустите VS Code

❌ "Project folder exists"

    Удалите существующую папку или выберите другое имя
