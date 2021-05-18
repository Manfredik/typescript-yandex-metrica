# Typescript обертка для работы с Yandex Metrika

``yarn add typescript-yandex-metrica``

# Использование
Параметры инициализации счетчика
https://yandex.ru/support/metrica/code/counter-initialize.html

Доступные методы
https://yandex.ru/support/metrica/objects/method-reference.html

```Typescript
import { Metrika } from "typescript-yandex-metrica"

// Инициализиурем счетчик
conts metrika = new Metrica(0000000);
// Отправляем событие
counter.fireEvent('CUSTOM_JS_EVENT').then(() => {});
// ручной вызов события просмотра URL (Когда defer = true)
counter.hit('http://example.domain/index.html').then(() => {});

// Вызов не описанных в обертке методов
metrika.getCounter().then((counter) => {
  counter.notBounce()
});

// Асинхронный вариант
(async function() {
  const counter = await metrika.getCounter();
  counter.notBounce();
})()


```