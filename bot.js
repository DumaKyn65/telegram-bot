// ==============================================
// ⚡ АВТОМАТИЧЕСКОЕ ПРОБУЖДЕНИЕ ДЛЯ RENDER
// ==============================================

const https = require('https');
const http = require('http');

// Функция для отправки keep-alive запроса
function keepAlive() {
    // ВАЖНО: Замените этот URL на ваш реальный URL Render
    const url = 'https://telegram-bot-deflorator.onrender.com';
    
    console.log('🔄 Отправляю keep-alive запрос...');
    
    // Используем https для Render (он использует HTTPS)
    https.get(url, (response) => {
        let data = '';
        
        // Собираем данные ответа
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        // Когда запрос завершен
        response.on('end', () => {
            console.log('✅ Keep-alive успешен!');
            console.log('📅 Время:', new Date().toLocaleString('ru-RU'));
            console.log('📊 Статус:', response.statusCode);
        });
        
    }).on('error', (error) => {
        console.log('⚠️ Ошибка keep-alive:', error.message);
    });
}

// ==============================================
// 📋 НАСТРОЙКИ ТАЙМЕРА
// ==============================================

// Интервал в миллисекундах (10 минут = 600000 мс)
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 минут

// Задержка перед первым запуском (1 минута после старта)
const INITIAL_DELAY = 60 * 1000; // 1 минута

// ==============================================
// 🚀 ЗАПУСК АВТОМАТИЧЕСКОГО ПРОБУЖДЕНИЯ
// ==============================================

console.log('⚙️ Настраиваю автоматическое пробуждение...');
console.log(`⏰ Интервал: ${KEEP_ALIVE_INTERVAL / 60000} минут`);

// Первый запрос через 1 минуту после запуска
setTimeout(() => {
    console.log('⏰ Первый keep-alive запрос через 1 минуту...');
    keepAlive();
}, INITIAL_DELAY);

// Регулярные запросы каждые 10 минут
const keepAliveInterval = setInterval(() => {
    keepAlive();
}, KEEP_ALIVE_INTERVAL);

console.log('✅ Автоматическое пробуждение настроено!');
console.log('==============================================');

// ==============================================
// 🌐 ВЕБ-СЕРВЕР ДЛЯ RENDER (ОБЯЗАТЕЛЬНО!)
// ==============================================

const express = require('express');
const app = express();

// Главная страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>DEFLORATOR++ Bot</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                }
                h1 { 
                    color: white; 
                    font-size: 2.5em;
                    margin-bottom: 20px;
                }
                .status { 
                    background: rgba(255, 255, 255, 0.2); 
                    padding: 25px; 
                    border-radius: 15px;
                    margin: 20px 0;
                }
                .emoji {
                    font-size: 3em;
                    margin-bottom: 20px;
                }
                .info {
                    font-size: 1.1em;
                    line-height: 1.6;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="emoji">🤖</div>
                <h1>DEFLORATOR++ Bot</h1>
                <div class="status">
                    <p class="info"><strong>🚀 Статус:</strong> ONLINE</p>
                    <p class="info"><strong>🕒 Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
                    <p class="info"><strong>📡 Хостинг:</strong> Render.com</p>
                    <p class="info"><strong>⚡ Авто-пробуждение:</strong> Активно</p>
                </div>
                <p class="info">📞 Напишите боту в Telegram: <strong>/start</strong></p>
                <p class="info">⏰ Последний пинг: <span id="pingTime">${new Date().toLocaleTimeString('ru-RU')}</span></p>
            </div>
            
            <script>
                // Обновляем время каждую минуту
                function updateTime() {
                    document.getElementById('pingTime').textContent = new Date().toLocaleTimeString('ru-RU');
                }
                setInterval(updateTime, 60000);
                
                // Авто-обновление страницы каждые 5 минут для keep-alive
                setTimeout(() => {
                    location.reload();
                }, 5 * 60 * 1000);
            </script>
        </body>
        </html>
    `);
});

// Страница статуса для мониторинга
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        service: 'DEFLORATOR++ Telegram Bot',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node_version: process.version,
        platform: process.platform,
        auto_wake: {
            enabled: true,
            interval_minutes: KEEP_ALIVE_INTERVAL / 60000,
            next_ping: new Date(Date.now() + KEEP_ALIVE_INTERVAL).toISOString()
        }
    });
});

// Эндпоинт для ручного пинга
app.get('/ping', (req, res) => {
    keepAlive();
    res.json({
        message: 'Keep-alive запрос отправлен вручную',
        time: new Date().toLocaleString('ru-RU')
    });
});

// Запуск сервера на порту от Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Веб-сервер запущен на порту ${PORT}`);
    console.log(`🔗 Главная страница: http://localhost:${PORT}`);
    console.log(`📊 Статус: http://localhost:${PORT}/status`);
    console.log(`🔄 Ручной пинг: http://localhost:${PORT}/ping`);
});

// ==============================================
// 🤖 ОСНОВНОЙ КОД TELEGRAM БОТА
// ==============================================

// Подключаем библиотеку для работы с Telegram Bot API
const TelegramBot = require('node-telegram-bot-api');

// ВАЖНО: Используем переменные окружения Render
const token = process.env.BOT_TOKEN || '8348200642:AAHdBx8BhphkRh8k3C47OyKw74MnhDkf62w';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || 1723862876;

// Проверка токена
if (!token || token === '8348200642:AAHdBx8BhphkRh8k3C47OyKw74MnhDkf62w') {
    console.error('❌ ВНИМАНИЕ: Используется хардкодный токен!');
    console.error('📝 Рекомендуется добавить BOT_TOKEN в Environment Variables Render');
}

console.log('🤖 Запускаю Telegram бота...');
console.log(`👑 Администратор: ${ADMIN_CHAT_ID}`);

// Создаем экземпляр бота. Опция `polling` используется для получения обновлений
const bot = new TelegramBot(token, {polling: true});

// База данных для хранения заказов (в реальном проекте нужно использовать настоящую БД)
const ordersDatabase = {};
const orderHistory = {}; // Отдельная база для истории заказов

// Функция для экранирования текста для MarkdownV2
function escapeMarkdown(text) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

// Функция для отправки главного меню
function sendMainMenu(chatId, text = null) {
    const menuText = text || `👨‍💻 *Добро пожаловать в DEFLORATOR\\+\\+* \\- бота для покупки кодов на любом языке программирования\\.\n\n`
        + `*Выберите действие:*`;
    
    const menuKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📦 Каталог', callback_data: 'catalog' }],
                [{ text: '🛒 Заказать', callback_data: 'order' }],
                [{ text: '❓ Помощь', callback_data: 'help' }],
                [{ text: '🛠️ Поддержка', callback_data: 'support' }]
            ]
        }
    };
    
    return bot.sendMessage(chatId, menuText, { 
        parse_mode: 'MarkdownV2',
        ...menuKeyboard
    });
}

// Команда /start - приветствие с инлайн кнопками
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'пользователь';
    
    const welcomeText = `👋 *Привет, ${userName}\\!*\n\n`
        + `🤖 *Я бот DEFLORATOR\\+\\+* \\- создаю коды на любом языке программирования\\.\n\n`
        + `⚡ *Бот работает 24/7 на Render\\.com*\n`
        + `⏰ *Авто\\-пробуждение:* активно \\(каждые 10 минут\\)\n`
        + `🕒 *Текущее время:* ${new Date().toLocaleString('ru-RU')}\n\n`
        + `*Выберите действие:*`;
    
    sendMainMenu(chatId, welcomeText);
});

// Команда /status для проверки работы бота
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    
    const statusText = `📊 *СТАТУС СИСТЕМЫ*\n\n`
        + `🤖 *Бот:* DEFLORATOR\\+\\+\n`
        + `🚀 *Статус:* РАБОТАЕТ\n`
        + `⏰ *Время работы:* ${Math.floor(process.uptime() / 60)} минут\n`
        + `📅 *Дата:* ${new Date().toLocaleString('ru-RU')}\n`
        + `⚡ *Авто\\-пробуждение:* АКТИВНО\n`
        + `🔄 *Интервал:* каждые 10 минут\n`
        + `🌐 *Хостинг:* Render\\.com\n`
        + `🔗 *Веб\\-страница:* https://telegram\\-bot\\-deflorator\\.onrender\\.com\n\n`
        + `✅ *Все системы работают нормально\\.*`;
    
    bot.sendMessage(chatId, statusText, { parse_mode: 'MarkdownV2' });
});

// Обработка инлайн кнопок
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    
    if (data === 'main_menu') {
        sendMainMenu(chatId);
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    if (data === 'catalog') {
        const catalogText = `*📦 КАТАЛОГ УСЛУГ DEFLORATOR\\+\\+*\n\n`
            + `*Языки программирования:*\n`
            + `1\\. Python \\- от 500 ₽ за скрипт\n`
            + `2\\. JavaScript/Node\\.js \\- от 700 ₽ за модуль\n`
            + `3\\. C\\# \\(Unity, \\.NET\\) \\- от 1000 ₽ за компонент\n`
            + `4\\. Java \\- от 900 ₽ за класс\n`
            + `5\\. PHP \\- от 600 ₽ за веб\\-скрипт\n`
            + `6\\. C\\+\\+ \\- от 1500 ₽ за алгоритм\n`
            + `7\\. Golang \\- от 1200 ₽ за микросервис\n`
            + `8\\. Rust \\- от 2000 ₽ за системный код\n\n`
            + `*Типы работ:*\n`
            + `• Парсинг данных с сайтов \\(включая обход защит\\)\n`
            + `• Телеграм\\-боты любой сложности \\(включая платежи\\)\n`
            + `• Автоматизация действий \\(кликеры, макросы, брутфорс\\)\n`
            + `• Взаимодействие с API \\(включая недокументированные\\)\n`
            + `• Чат\\-боты с ИИ \\(нейросети, обработка естественного языка\\)\n`
            + `• Взлом игр \\(читы, моды, тренажеры, изменения памяти\\)\n`
            + `• Обход защиты и лицензий \\(кейгены, патчи, кряки\\)\n`
            + `• Кастомные скрипты для хакерских инструментов\n`
            + `• Инжекты и DLL\\-библиотеки\n`
            + `• Бэкдоры и руткиты\n`
            + `• Криптография и стеганография\n\n`
            + `*Для заказа нажмите кнопку "🛒 Заказать" ниже:*`;
        
        const catalogKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🛒 Заказать', callback_data: 'order' }],
                    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                ]
            }
        };
        
        bot.editMessageText(catalogText, {
            chat_id: chatId,
            message_id: msg.message_id,
            parse_mode: 'MarkdownV2',
            ...catalogKeyboard
        });
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    if (data === 'order') {
        // Инициализируем объект заказа для этого пользователя
        ordersDatabase[chatId] = {
            step: 'language',
            details: {}
        };
        
        const langKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Python', callback_data: 'lang_python' }],
                    [{ text: 'JavaScript', callback_data: 'lang_javascript' }],
                    [{ text: 'C#', callback_data: 'lang_csharp' }],
                    [{ text: 'Java', callback_data: 'lang_java' }],
                    [{ text: 'PHP', callback_data: 'lang_php' }],
                    [{ text: 'C++', callback_data: 'lang_cpp' }],
                    [{ text: 'Golang', callback_data: 'lang_golang' }],
                    [{ text: 'Rust', callback_data: 'lang_rust' }],
                    [{ text: 'Другой язык', callback_data: 'lang_other' }],
                    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                ]
            }
        };
        
        bot.editMessageText('🎯 *Шаг 1 из 4*\nВыберите язык программирования для вашего кода:', {
            chat_id: chatId,
            message_id: msg.message_id,
            parse_mode: 'Markdown',
            ...langKeyboard
        });
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    // Обработка выбора языка
    if (data.startsWith('lang_')) {
        const languageMap = {
            'lang_python': 'Python',
            'lang_javascript': 'JavaScript',
            'lang_csharp': 'C#',
            'lang_java': 'Java',
            'lang_php': 'PHP',
            'lang_cpp': 'C++',
            'lang_golang': 'Golang',
            'lang_rust': 'Rust',
            'lang_other': 'Другой язык'
        };
        
        if (ordersDatabase[chatId]) {
            ordersDatabase[chatId].details.language = languageMap[data] || 'Другой язык';
            ordersDatabase[chatId].step = 'type';
            
            const typeKeyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Парсинг данных', callback_data: 'type_parsing' }],
                        [{ text: 'Телеграм-бот', callback_data: 'type_telegram' }],
                        [{ text: 'Автоматизация', callback_data: 'type_automation' }],
                        [{ text: 'Работа с API', callback_data: 'type_api' }],
                        [{ text: 'Чат-бот с ИИ', callback_data: 'type_ai' }],
                        [{ text: 'Взлом игр (читы)', callback_data: 'type_hacking' }],
                        [{ text: 'Обход защиты', callback_data: 'type_bypass' }],
                        [{ text: 'Хакерский инструмент', callback_data: 'type_hacker' }],
                        [{ text: 'Инжект/DLL', callback_data: 'type_inject' }],
                        [{ text: 'Криптография', callback_data: 'type_crypto' }],
                        [{ text: 'Бэкдор/Руткит', callback_data: 'type_backdoor' }],
                        [{ text: 'Другое', callback_data: 'type_other' }],
                        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                    ]
                }
            };
            
            bot.editMessageText(`✅ Выбран язык: ${languageMap[data] || 'Другой язык'}\n\n🛠️ *Шаг 2 из 4*\nВыберите тип задачи:`, {
                chat_id: chatId,
                message_id: msg.message_id,
                parse_mode: 'Markdown',
                ...typeKeyboard
            });
        }
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    // Обработка выбора типа задачи
    if (data.startsWith('type_')) {
        const typeMap = {
            'type_parsing': 'Парсинг данных',
            'type_telegram': 'Телеграм-бот',
            'type_automation': 'Автоматизация',
            'type_api': 'Работа с API',
            'type_ai': 'Чат-бот с ИИ',
            'type_hacking': 'Взлом игр (читы)',
            'type_bypass': 'Обход защиты',
            'type_hacker': 'Хакерский инструмент',
            'type_inject': 'Инжект/DLL',
            'type_crypto': 'Криптография',
            'type_backdoor': 'Бэкдор/Руткит',
            'type_other': 'Другое'
        };
        
        if (ordersDatabase[chatId]) {
            ordersDatabase[chatId].details.type = typeMap[data] || 'Другое';
            ordersDatabase[chatId].step = 'description';
            
            bot.editMessageText(`✅ Выбран тип: ${typeMap[data] || 'Другое'}\n\n📝 *Шаг 3 из 4*\nОпишите задачу максимально подробно:\n\n• Что должен делать код?\n• Какие данные обрабатывать?\n• Требования к производительности?\n• Сроки выполнения?\n• Особые требования (обход защиты, скрытность и т.д.)?\n\n*Отправьте текстовое сообщение с описанием:*`, {
                chat_id: chatId,
                message_id: msg.message_id,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                    ]
                }
            });
        }
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    if (data === 'help') {
        const helpText = `*СПРАВКА DEFLORATOR\\+\\+*\n\n`
            + `*1\\.* Ознакомьтесь с каталогом языков и типов задач через кнопку "Каталог"\n\n`
            + `*2\\.* Оформите заказ через кнопку "Заказать"\n\n`
            + `*3\\.* Сделайте скриншот после того как ваш заказ примут\\.\n\n`
            + `*4\\.* Остальные вопросы можно задать лично администратору\\.\n\n`
            + `*Гарантии:*\n`
            + `• Конфиденциальность гарантирована\n`
            + `• До 3 правок по требованию\n`
            + `• Поддержка 24/7`;
        
        const helpKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📦 Каталог', callback_data: 'catalog' }],
                    [{ text: '🛒 Заказать', callback_data: 'order' }],
                    [{ text: '🛠️ Поддержка', callback_data: 'support' }],
                    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                ]
            }
        };
        
        bot.editMessageText(helpText, {
            chat_id: chatId,
            message_id: msg.message_id,
            parse_mode: 'MarkdownV2',
            ...helpKeyboard
        });
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    if (data === 'support') {
        const supportText = `*🛠️ ПОДДЕРЖКА DEFLORATOR\\+\\+*\n\n`
            + `*Связь с разработчиком:*\n`
            + `Telegram: @DEFLORRATOR\n\n`
            + `*Часы работы поддержки:*\n`
            + `Круглосуточно \\(если админ не занят\\)\n\n`
            + `*Среднее время ответа:*\n`
            + `До 1 часа\n\n`
            + `*По вопросам:*\n`
            + `• Технические проблемы с ботом\n`
            + `• Вопросы по заказам\n`
            + `• Консультации по техзаданиям\n`
            + `• Проверка статуса оплаты\n`
            + `• Срочные заказы\n\n`
            + `*Пишите сразу по делу, прикладывайте ID заказа если есть\\.*`;
        
        const supportKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                ]
            }
        };
        
        bot.editMessageText(supportText, {
            chat_id: chatId,
            message_id: msg.message_id,
            parse_mode: 'MarkdownV2',
            ...supportKeyboard
        });
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    // Обработка кнопок оплаты и управления заказами
    if (data.startsWith('pay_')) {
        const orderId = data.split('_')[1];
        const order = getOrderById(orderId);
        
        if (order) {
            bot.answerCallbackQuery(callbackQuery.id, { text: 'Инструкция по оплате отправлена в чат' });
            
            const paymentInstructions = `*Инструкция по оплате заказа ${escapeMarkdown(orderId)}:*\n\n`
                + `1\\. Выберите способ оплата из списка ниже\n`
                + `2\\. Переведите ${order.price || 'N/A'} ₽ на выбранный реквизит\n`
                + `3\\. Обязательно укажите в комментарии: ${escapeMarkdown(orderId)}\n`
                + `4\\. Сделайте скриншот чека об оплате\n`
                + `5\\. Отправьте скриншот в этот чат\n\n`
                + `*Реквизиты:*\n`
                + `СБЕР: 2202 2001 2345 6789\n`
                + `ТИНЬКОФФ: 5536 9137 1234 5678\n`
                + `QIWI: \\+79991234567\n`
                + `USDT \\(TRC20\\): TAbcDeF1234567890ghiJKlmnOpQRStuv`;
            
            const paymentKeyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                    ]
                }
            };
            
            bot.sendMessage(chatId, paymentInstructions, { 
                parse_mode: 'MarkdownV2',
                ...paymentKeyboard
            });
        } else {
            bot.answerCallbackQuery(callbackQuery.id, { text: 'Заказ не найден!' });
        }
        return;
    }
    
    if (data.startsWith('cancel_')) {
        const orderId = data.split('_')[1];
        bot.answerCallbackQuery(callbackQuery.id, { text: 'Запрос на отмену отправлен администратору' });
        
        // Уведомляем администратора
        bot.sendMessage(ADMIN_CHAT_ID, `⚠️ Запрос на отмену заказа ${escapeMarkdown(orderId)} от @${escapeMarkdown(msg.chat.username || 'без юзернейма')} \\(ID: ${chatId}\\)`, { parse_mode: 'MarkdownV2' });
        
        const cancelKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                ]
            }
        };
        
        bot.sendMessage(chatId, `Запрос на отмену заказа ${escapeMarkdown(orderId)} отправлен администратору\\. Ожидайте подтверждения\\.`, { 
            parse_mode: 'MarkdownV2',
            ...cancelKeyboard
        });
        return;
    }
    
    if (data.startsWith('edit_')) {
        const orderId = data.split('_')[1];
        bot.answerCallbackQuery(callbackQuery.id, { text: 'Для изменения заказа свяжитесь с поддержкой' });
        
        const editKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🛠️ Поддержка', callback_data: 'support' }],
                    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                ]
            }
        };
        
        bot.sendMessage(chatId, `Для изменения заказа ${escapeMarkdown(orderId)} свяжитесь с поддержкой через кнопку "Поддержка"`, { 
            parse_mode: 'MarkdownV2',
            ...editKeyboard
        });
        return;
    }
    
    // Административные кнопки
    if (data.startsWith('admin_')) {
        // Проверяем, что это админ
        if (chatId !== ADMIN_CHAT_ID) {
            bot.answerCallbackQuery(callbackQuery.id, { text: 'Доступ запрещен!' });
            return;
        }
        
        // Принятие заказа
        if (data.startsWith('admin_accept_')) {
            const orderId = data.replace('admin_accept_', '');
            const order = getOrderById(orderId);
            
            if (order) {
                // Обновляем статус заказа
                order.status = 'в работе';
                updateOrderStatus(orderId, 'в работе');
                
                // Отправляем уведомление клиенту
                const clientNotification = `📢 *ВАШ ЗАКАЗ ПРИНЯТ\\!*\n\n`
                    + `*Номер заказа:* ${escapeMarkdown(orderId)}\n\n`
                    + `*Примечание:* Ваш заказ принят\\. ТАК ЖЕ ОБЯЗАТЕЛЬНО СДЕЛАЙТЕ СКРИНШОТ С ТЕКСТОМ ГДЕ НАПИСАНО, ЧТО ВАШ ЗАКАЗ ПРИНЯТ\\.\n\n`
                    + `*Следующий шаг:* Ожидайте сообщения от кодера \\(до \\~1 часа\\)`;
                
                const clientKeyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                        ]
                    }
                };
                
                bot.sendMessage(order.customerId, clientNotification, { 
                    parse_mode: 'MarkdownV2',
                    ...clientKeyboard
                });
                
                // Обновляем сообщение админу
                bot.editMessageText(`✅ *Заказ принят в работу\\!*\n\n`
                    + `*ID заказа:* ${escapeMarkdown(orderId)}\n`
                    + `*Клиент:* @${escapeMarkdown(order.customerUsername)}\n`
                    + `*Статус:* В РАБОТЕ\n`
                    + `*Дата принятия:* ${new Date().toLocaleString('ru-RU')}`, {
                    chat_id: chatId,
                    message_id: msg.message_id,
                    parse_mode: 'MarkdownV2'
                });
                
                bot.answerCallbackQuery(callbackQuery.id, { text: 'Заказ принят в работу!' });
            } else {
                bot.answerCallbackQuery(callbackQuery.id, { text: 'Заказ не найден!' });
            }
            return;
        }
        
        // Отклонение заказа
        if (data.startsWith('admin_reject_')) {
            const orderId = data.replace('admin_reject_', '');
            const order = getOrderById(orderId);
            
            if (order) {
                // Обновляем статус заказа
                order.status = 'отклонен';
                updateOrderStatus(orderId, 'отклонен');
                
                // Отправляем уведомление клиенту
                const clientNotification = `📢 *ВАШ ЗАКАЗ ОТКЛОНЕН\\!*\n\n`
                    + `*Номер заказа:* ${escapeMarkdown(orderId)}\n\n`
                    + `*Причина:* Заказ не соответствует требованиям сервиса\\.\n\n`
                    + `*Что делать:*\n`
                    + `1\\. Проверьте описание заказа\n`
                    + `2\\. Убедитесь, что задача соответствует нашим услугам\n`
                    + `3\\. Создайте новый заказ или обратитесь в поддержку`;
                
                const clientKeyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🛒 Новый заказ', callback_data: 'order' }],
                            [{ text: '🛠️ Поддержка', callback_data: 'support' }],
                            [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                        ]
                    }
                };
                
                bot.sendMessage(order.customerId, clientNotification, { 
                    parse_mode: 'MarkdownV2',
                    ...clientKeyboard
                });
                
                // Обновляем сообщение админу
                bot.editMessageText(`❌ *Заказ отклонен\\!*\n\n`
                    + `*ID заказа:* ${escapeMarkdown(orderId)}\n`
                    + `*Клиент:* @${escapeMarkdown(order.customerUsername)}\n`
                    + `*Статус:* ОТКЛОНЕН\n`
                    + `*Дата отклонения:* ${new Date().toLocaleString('ru-RU')}`, {
                    chat_id: chatId,
                    message_id: msg.message_id,
                    parse_mode: 'MarkdownV2'
                });
                
                bot.answerCallbackQuery(callbackQuery.id, { text: 'Заказ отклонен!' });
            } else {
                bot.answerCallbackQuery(callbackQuery.id, { text: 'Заказ не найден!' });
            }
            return;
        }
        
        // Просмотр всех заказов
        if (data === 'admin_all_orders') {
            const allOrders = getAllOrders();
            let adminText = '*📋 ВСЕ АКТИВНЫЕ ЗАКАЗЫ:*\n\n';
            
            if (allOrders.length > 0) {
                allOrders.forEach((order, index) => {
                    adminText += `*Заказ #${index + 1}:* ${escapeMarkdown(order.id)}\n`
                        + `*Клиент:* @${escapeMarkdown(order.customerUsername)} \\(${order.customerId}\\)\n`
                        + `*Язык:* ${escapeMarkdown(order.language)}\n`
                        + `*Тип:* ${escapeMarkdown(order.type)}\n`
                        + `*Цена:* ${order.price} ₽\n`
                        + `*Статус:* ${escapeMarkdown(order.status)}\n`
                        + `*Дата:* ${escapeMarkdown(order.date)}\n`
                        + `\\-\\-\\-\n`;
                });
            } else {
                adminText = 'Нет активных заказов\\.';
            }
            
            const adminKeyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                    ]
                }
            };
            
            bot.editMessageText(adminText, {
                chat_id: chatId,
                message_id: msg.message_id,
                parse_mode: 'MarkdownV2',
                ...adminKeyboard
            });
            bot.answerCallbackQuery(callbackQuery.id);
            return;
        }
    }
    
    // Обработка выбора способа связи
    if (data === 'contact_phone') {
        const contactKeyboard = {
            reply_markup: {
                keyboard: [
                    [{ text: '📞 Отправить номер телефона', request_contact: true }],
                    [{ text: '🏠 Главное меню' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        };
        
        bot.sendMessage(chatId, 'Нажмите кнопку ниже, чтобы отправить номер телефона:', contactKeyboard);
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    if (data === 'contact_telegram') {
        if (ordersDatabase[chatId]) {
            ordersDatabase[chatId].details.contact = `Telegram @${callbackQuery.from.username || 'без юзернейма'}`;
            completeOrder(chatId, { from: callbackQuery.from });
        }
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
    
    if (data === 'contact_manual') {
        if (ordersDatabase[chatId]) {
            ordersDatabase[chatId].step = 'waiting_manual_contact';
            
            bot.sendMessage(chatId, '✏️ *Укажите ваш контакт для связи:*\n\nНапример:\n• Email: example@mail.com\n• Telegram: @username\n• Другая соцсеть\n• Номер телефона: +79991234567\n\n*Отправьте текстовое сообщение с контактом:*', { 
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [[{ text: '🏠 Главное меню' }]],
                    resize_keyboard: true
                }
            });
        }
        bot.answerCallbackQuery(callbackQuery.id);
        return;
    }
});

// Обработка текстовых сообщений для описания задачи и контактов
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Пропускаем команды
    if (text && text.startsWith('/')) return;
    
    // Обработка кнопки "Главное меню" в текстовых сообщениях
    if (text === '🏠 Главное меню') {
        sendMainMenu(chatId);
        
        // Сбрасываем состояние заказа если было
        if (ordersDatabase[chatId] && ordersDatabase[chatId].step) {
            delete ordersDatabase[chatId];
        }
        return;
    }
    
    // Проверяем, находится ли пользователь в процессе оформления заказа
    if (ordersDatabase[chatId] && ordersDatabase[chatId].step) {
        const order = ordersDatabase[chatId];
        
        if (order.step === 'description') {
            order.details.description = text;
            order.step = 'contact_method';
            
            const contactMethodKeyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📞 Отправить номер телефона', callback_data: 'contact_phone' }],
                        [{ text: '👤 Использовать Telegram', callback_data: 'contact_telegram' }],
                        [{ text: '✏️ Указать контакт вручную', callback_data: 'contact_manual' }],
                        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
                    ]
                }
            };
            
            bot.sendMessage(chatId, `✅ Описание сохранено!\n\n📞 *Шаг 4 из 4*\nВыберите способ связи:`, { 
                parse_mode: 'Markdown',
                ...contactMethodKeyboard
            });
            return;
        }
        
        // Если пользователь выбрал "Указать вручную", ждем текстовый контакт
        if (order.step === 'waiting_manual_contact' && text) {
            order.details.contact = text;
            
            // Завершаем оформление заказа
            completeOrder(chatId, msg);
            return;
        }
    }
});

// Обработка отправки контакта через кнопку
bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    
    if (ordersDatabase[chatId] && ordersDatabase[chatId].step) {
        ordersDatabase[chatId].details.contact = `Телефон: ${msg.contact.phone_number}`;
        completeOrder(chatId, msg);
    }
});

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАКАЗАМИ =====

// Функция завершения оформления заказа
function completeOrder(chatId, msg) {
    if (!ordersDatabase[chatId] || !ordersDatabase[chatId].details) return;
    
    const order = ordersDatabase[chatId];
    
    // Генерация ID заказа
    const orderId = 'DEF-' + Date.now().toString().slice(-6);
    order.details.id = orderId;
    order.details.status = 'ожидает проверки';
    order.details.price = calculatePrice(order.details.language, order.details.type);
    order.details.date = new Date().toLocaleString('ru-RU');
    order.details.customerId = chatId;
    order.details.customerUsername = msg.from.username || 'без юзернейма';
    
    // Сохраняем заказ в историю
    saveOrder(order.details);
    
    // Формируем сводку заказа для клиента
    const summary = `✅ *ЗАКАЗ ОФОРМЛЕН\\!*\n\n`
        + `*Номер заказа:* ${escapeMarkdown(orderId)}\n`
        + `*Язык программирования:* ${escapeMarkdown(order.details.language)}\n`
        + `*Тип задачи:* ${escapeMarkdown(order.details.type)}\n`
        + `*Описание:* ${escapeMarkdown(order.details.description.substring(0, 100))}...\n`
        + `*Контакт:* ${escapeMarkdown(order.details.contact)}\n`
        + `*Стоимость:* ${order.details.price} ₽\n\n`
        + `📌 *Ожидайте вердикта администрации\\. Заказ будет проверен в течение 1\\-24 часов\\.*\n\n`
        + `*Вы получите уведомление когда заказ будет принят или отклонен\\.*`;
    
    const orderCompleteKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🛠️ Поддержка', callback_data: 'support' }],
                [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, summary, { 
        parse_mode: 'MarkdownV2',
        ...orderCompleteKeyboard
    });
    
    // Очищаем временные данные
    ordersDatabase[chatId] = null;
    
    // Оповещаем администратора (вас) о новом заказе с кнопками управления
    const adminNotification = `🚨 *НОВЫЙ ЗАКАЗ\\!*\n\n`
        + `*ID заказа:* ${escapeMarkdown(orderId)}\n`
        + `*Клиент:* @${escapeMarkdown(order.details.customerUsername)} \\(ID: ${order.details.customerId}\\)\n`
        + `*Язык:* ${escapeMarkdown(order.details.language)}\n`
        + `*Тип:* ${escapeMarkdown(order.details.type)}\n`
        + `*Стоимость:* ${order.details.price} ₽\n`
        + `*Контакт:* ${escapeMarkdown(order.details.contact)}\n\n`
        + `*Описание задачи:*\n`
        + `${escapeMarkdown(order.details.description)}\n\n`
        + `*Статус:* ${escapeMarkdown(order.details.status)}\n`
        + `*Дата:* ${escapeMarkdown(order.details.date)}\n\n`
        + `*Управление заказом:*`;
    
    const adminKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '✅ Принять заказ', callback_data: `admin_accept_${orderId}` }],
                [{ text: '❌ Отклонить заказ', callback_data: `admin_reject_${orderId}` }],
                [{ text: '📋 Все заказы', callback_data: 'admin_all_orders' }],
                [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
        }
    };
    
    bot.sendMessage(ADMIN_CHAT_ID, adminNotification, { 
        parse_mode: 'MarkdownV2',
        ...adminKeyboard
    });
    
    // Убираем клавиатуру если была
    bot.sendMessage(chatId, '✅ Заказ успешно создан! Ожидайте решения администрации.', {
        reply_markup: { remove_keyboard: true }
    });
}

// Функция расчета стоимости
function calculatePrice(language, type) {
    let basePrice = 500;
    
    // Наценка за язык
    const langPrices = {
        'Python': 500,
        'JavaScript': 700,
        'C#': 1000,
        'Java': 900,
        'PHP': 600,
        'C++': 1500,
        'Golang': 1200,
        'Rust': 2000,
        'Другой язык': 800
    };
    
    basePrice = langPrices[language] || 700;
    
    // Наценка за сложность типа задачи
    if (type.includes('взлом') || type.includes('читы') || type.includes('кряк') || type.includes('кейген')) {
        basePrice *= 3;
    } else if (type.includes('хакер') || type.includes('инжект') || type.includes('DLL') || type.includes('бэкдор') || type.includes('руткит')) {
        basePrice *= 3.5;
    } else if (type.includes('парсинг') || type.includes('автоматизация') || type.includes('брутфорс')) {
        basePrice *= 1.8;
    } else if (type.includes('ИИ') || type.includes('нейросеть') || type.includes('криптограф')) {
        basePrice *= 2.5;
    } else if (type.includes('обход') || type.includes('защит')) {
        basePrice *= 2.2;
    }
    
    return Math.round(basePrice / 100) * 100; // Округляем до сотен
}

// Функция сохранения заказа
function saveOrder(order) {
    if (!orderHistory[order.customerId]) {
        orderHistory[order.customerId] = [];
    }
    orderHistory[order.customerId].push(order);
}

// Функция получения заказа по ID
function getOrderById(orderId) {
    for (const userId in orderHistory) {
        const userOrders = orderHistory[userId];
        const order = userOrders.find(o => o.id === orderId);
        if (order) return order;
    }
    return null;
}

// Функция получения всех заказов пользователя
function getOrdersByUserId(userId) {
    return orderHistory[userId] || [];
}

// Функция получения всех заказов
function getAllOrders() {
    const allOrders = [];
    for (const userId in orderHistory) {
        allOrders.push(...orderHistory[userId]);
    }
    return allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Функция обновления статуса заказа
function updateOrderStatus(orderId, newStatus) {
    for (const userId in orderHistory) {
        const userOrders = orderHistory[userId];
        const orderIndex = userOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orderHistory[userId][orderIndex].status = newStatus;
            return true;
        }
    }
    return false;
}

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error.code);
});

// ==============================================
// 📝 ЛОГИРОВАНИЕ УСПЕШНОГО ЗАПУСКА
// ==============================================

console.log('==============================================');
console.log('🤖 Бот DEFLORATOR++ успешно запущен!');
console.log(`👑 Администратор: ${ADMIN_CHAT_ID}`);
console.log(`🌐 Хостинг: Render.com`);
console.log(`⚡ Авто-пробуждение: АКТИВНО`);
console.log(`🔄 Интервал пинга: ${KEEP_ALIVE_INTERVAL / 60000} минут`);
console.log(`⏰ Первый пинг через: ${INITIAL_DELAY / 1000} секунд`);
console.log('==============================================');
console.log('✅ Система готова к работе!');
console.log('⏳ Ожидание команд...');
