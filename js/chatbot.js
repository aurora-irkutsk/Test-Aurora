// chatbot.js — финальная версия с проверкой телефона и белым текстом
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

        // Обработчик клика на кнопку
        this.toggle.addEventListener('click', () => {
            if (this.widget.style.display === 'none') {
                this.showChat();
                if (this.step === 0) this.loadInitialMessage();
            } else {
                this.hideChat();
            }
        });

        // Обработчик ввода
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

    addUserMessage(text) {
        const el = document.createElement('div');
        el.style.padding = '8px 0';
        el.style.textAlign = 'right';
        el.style.color = '#ffffff';
        el.innerHTML = text.replace(/\n/g, '<br>');
        this.messages.appendChild(el);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

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
            await this.sleep(60);
        }
    }

    async loadInitialMessage() {
        if (this.step === 0) {
            const text = 'Здравствуйте! 👋\n\nМеня зовут Алина, я помогу вам оформить заявку на перетяжку или ремонт мебели.\n\nПожалуйста, напишите, что вас интересует — например:\n• Перетяжка дивана\n• Ремонт кресла\n• Замена наполнителя\n• Частичная перетяжка\n• Ремонт каркаса\n• Выезд мастера\n\nЯ всё запишу и уточню детали!';
            await this.typeMessage(text);
            this.step = 1;
        }
    }

    async handleStep(value) {
        if (this.step === 1) {
            this.data.work = value;
            await this.typeMessage(`Отлично! Вы хотите: «${value}».\n\nТеперь укажите, пожалуйста, адрес, где находится мебель (город, район, улица):`);
            this.step = 2;
        } else if (this.step === 2) {
            this.data.address = value;
            await this.typeMessage(`Спасибо! Адрес: ${value}.\n\nТеперь введите ваш номер телефона:\n\nВведите **ровно 10 цифр** (без пробелов и знаков). Пример: 9025605225`);
            this.step = 3;
        } else if (this.step === 3) {
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                await this.typeMessage('❌ Номер должен содержать 10 цифр. Пожалуйста, введите снова.');
                return;
            }

            const fullPhone = '+7' + cleanPhone.padStart(10, '0');
            this.data.phone = fullPhone;

            try {
                const payload = {
                    work: this.data.work,
                    address: this.data.address,
                    phone: fullPhone
                };

                const res = await fetch('https://test-aurora-aurora-bot.up.railway.app/submit', {
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
                await this.typeMessage('❌ Нет соединения с сервером. Попробуйте позже.');
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