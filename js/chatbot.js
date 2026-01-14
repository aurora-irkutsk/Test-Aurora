// chatbot.js — чат-бот с проверкой телефона и белым цветом текста
class ChatBot {
    constructor() {
        this.step = 0;
        this.data = {};
        this.messages = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.widget = document.getElementById('chat-widget');
        this.toggle = document.getElementById('chat-toggle');

        // Показываем чат через 3 секунды
        setTimeout(() => {
            this.showChat();
            this.loadInitialMessage();
        }, 3000);

        // Клик по кнопке — показать/скрыть чат
        this.toggle.addEventListener('click', () => {
            if (this.widget.style.display === 'none') {
                this.showChat();
                if (this.step === 0) this.loadInitialMessage();
            } else {
                this.hideChat();
            }
        });

        // Отправка по Enter
        this.input.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return;
            const value = this.input.value.trim();
            if (!value) return;

            this.addUserMessage(value);
            this.input.value = '';
            this.handleStep(value);
        });
    }

    showChat() {
        this.widget.style.display = 'block';
        this.toggle.style.opacity = '1';
    }

    hideChat() {
        this.widget.style.display = 'none';
        this.toggle.style.opacity = '0.8';
    }

    // Сообщение от пользователя — белый текст
    addUserMessage(text) {
        const el = document.createElement('div');
        el.style.padding = '8px 0';
        el.style.textAlign = 'right';
        el.style.color = '#ffffff'; // БЕЛЫЙ ЦВЕТ
        el.innerHTML = text.replace(/\n/g, '<br>');
        this.messages.appendChild(el);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    // Сообщение от бота — с эффектом набора
    async typeMessage(text) {
        const el = document.createElement('div');
        el.style.padding = '8px 0';
        el.style.textAlign = 'left';
        el.style.color = '#ffffff';
        el.innerHTML = '';
        this.messages.appendChild(el);

        let currentHTML = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                currentHTML += '<br>';
            } else {
                currentHTML += text[i];
            }
            el.innerHTML = currentHTML;
            this.messages.scrollTop = this.messages.scrollHeight;
            await this.sleep(60); // медленнее — 60 мс
        }
    }

    async loadInitialMessage() {
        if (this.step === 0) {
            const text = 'Здравствуйте! 👋\n\nМеня зовут Алина, я помогу вам оформить заявку на перетяжку или ремонт мебели.\n\nПожалуйста, напишите, что вас интересует — например:\n\n• Перетяжка дивана\n• Ремонт кресла\n• Замена наполнителя\n• Частичная перетяжка\n• Ремонт каркаса\n• Выезд мастера\n\nЯ всё запишу и уточню детали!';
            await this.typeMessage(text);
            this.step = 1;
        }
    }

    async handleStep(value) {
        if (this.step === 1) {
            this.data.work = value; // записываем то, что написал клиент
            await this.typeMessage(`Отлично! Вы хотите: «${value}».\n\nТеперь укажите, пожалуйста, адрес, где находится мебель (город, район, улица):`);
            this.step = 2;
        } else if (this.step === 2) {
            this.data.address = value;
            await this.typeMessage(`Спасибо! Адрес: ${value}.\n\nТеперь введите ваш номер телефона:\n\nПример: 9025605225`);
            this.step = 3;
        } else if (this.step === 3) {
            // Проверяем номер телефона
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                await this.typeMessage('❌ Номер должен содержать 10 цифр. Пожалуйста, введите снова.');
                this.step = 3; // остаёмся на том же шаге
                return;
            }

            const fullPhone = '+7' + cleanPhone.padStart(10, '0');
            this.data.phone = fullPhone;

            try {
                // Формируем данные для отправки
                const payload = {
                    work: this.data.work,
                    address: this.data.address,
                    phone: fullPhone
                };

                const res = await fetch('https://your-app.railway.app/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    await this.typeMessage(`✅ Заявка отправлена!\nМастер свяжется с вами в течение 30 минут по номеру ${fullPhone}.\nХорошего дня! 😊`);
                } else {
                    await this.typeMessage('❌ Произошла ошибка. Попробуйте позже или позвоните напрямую.');
                }
            } catch (err) {
                await this.typeMessage('❌ Не удалось отправить заявку. Попробуйте позже или позвоните напрямую. +7 902 560 52 25');
            }

            this.step = 0;
            setTimeout(() => this.hideChat(), 4000);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});