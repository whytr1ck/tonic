# Tonic

Telegram Mini App для отслеживания криптопортфеля TON и настройки ценовых алертов.

## Технологии

- Vue 3 + TypeScript + Vite
- Pinia (state management)
- TailwindCSS 4
- TON Connect (@tonconnect/ui)
- Telegram WebApp SDK (@twa-dev/sdk)
- ApexCharts (графики)

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

## Переменные окружения

Скопируй `.env.example` в `.env`:

```bash
cp .env.example .env
```

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| VITE_USE_MOCK | Использовать mock данные вместо API | true |
| VITE_TONAPI_KEY | API ключ для TONAPI | - |
| VITE_TON_NETWORK | Сеть TON (mainnet/testnet) | mainnet |

## Структура проекта

```
src/
├── app/                 # Конфигурация приложения
├── shared/              # Общие компоненты и утилиты
└── modules/             # Feature-модули
    ├── telegram/        # Интеграция с Telegram
    ├── wallet/          # TON Connect
    ├── portfolio/       # Данные портфеля
    ├── alerts/          # Price alerts
    └── home/            # Главная страница
```

Подробнее см. [ARCHITECTURE.md](./ARCHITECTURE.md)

## Разработка

### IDE

VS Code + расширение [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Правила кода

См. [.claude/project_rules.md](./.claude/project_rules.md)

### Тестирование в Telegram

1. Создай бота через @BotFather
2. Включи Mini App в настройках бота
3. Укажи URL dev сервера (нужен https, используй ngrok)
