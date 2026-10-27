# Ocultar / mostrar historia de Instagram en masa

Dos scripts para el navegador que marcan o desmarcan seguidores en la lista **"Ocultar historia a"** de Instagram, con pausas para no saturar al servidor.

| Archivo | Qué hace |
|---|---|
| `ocultar-historia.js` | Oculta tu historia a **todos** tus seguidores, **menos** a los que pongas en la lista `EXCLUIR`. |
| `mostrar-historia-a-todos.js` | Desmarca a **todos**, así tu historia vuelve a verla todo el mundo. |

---

## Requisitos

- Una **computadora** (en el celular no hay consola).
- Chrome, Edge o Firefox con tu cuenta de Instagram iniciada.

---

## Cómo usar `ocultar-historia.js`

1. Abrí el archivo con el Bloc de notas o VS Code.
2. En la parte de **CONFIGURACIÓN**, poné en `EXCLUIR` los usuarios que **sí** van a ver la historia (sin @):
   ```js
   const EXCLUIR = [
     'juanperez',
     'maria.gomez',
   ];
   ```
3. Copiá **todo** el contenido del archivo (Ctrl+A, Ctrl+C).
4. Entrá a: `https://www.instagram.com/accounts/hide_story_and_live_from/`
5. Esperá a que se vea la lista de seguidores con los círculos a la derecha.
6. Abrí la consola: **F12** → pestaña **Console**.
7. Pegá (Ctrl+V) y apretá **Enter**.
8. Dejá la pestaña abierta hasta que aparezca **✅ Fin**.
9. Revisá que las personas de `EXCLUIR` queden **sin** círculo azul.
10. Subí la historia normal desde el celular (no a Mejores amigos).

## Cómo usar `mostrar-historia-a-todos.js`

Igual que el anterior, desde el paso 3. No hay que configurar nada.

---

## Si Chrome no te deja pegar

La primera vez Chrome bloquea el pegado en la consola:

1. Pegá: aparece un aviso amarillo.
2. Escribí a mano `allow pasting` y apretá **Enter**.
3. Volvé a pegar.

En Firefox se escribe `allow pasting` o `permitir pegar`.

---

## Para frenarlo

Escribí en la consola y apretá Enter:

```js
pararScript = true
```

---

## Mensajes en la consola

| Mensaje | Qué significa |
|---|---|
| `▶ Arrancando (N seguidores visibles)` | Empezó. Si N es 0, la lista no cargó: recargá la página. |
| `✔ 12/600 ocultando a usuario` | Va bien. |
| `⏸ Descanso de 60 s` | Pausa automática, no toques nada. |
| `⛔ Error 429` / `aviso` | Instagram lo frenó. **No lo vuelvas a correr hasta el día siguiente.** |
| `⛔ Los clics no tienen efecto` | Instagram cambió la página o no responde. Recargá y probá de nuevo. |
| `✅ Fin` | Terminó. Si dice que llegaste al tope, volvé a correrlo en un par de horas y sigue donde quedó. |

---

## Configuración de velocidad

Por defecto hace unos **600 cambios por hora**, con un descanso de 1 minuto cada 60 clics.

| Variable | Qué controla | Valor |
|---|---|---|
| `PAUSA_MIN` / `PAUSA_MAX` | Espera entre clics (ms) | 2500 / 5000 |
| `CADA_CUANTOS` | Cada cuántos clics descansa | 60 |
| `DESCANSO_MIN` / `DESCANSO_MAX` | Duración del descanso (ms) | 45000 / 75000 |
| `MAX_POR_SESION` | Tope de clics por ejecución | 600 |
| `ESPERA_SCROLL` | Espera para que cargue más lista (ms) | 2500 |

**Más seguro:** subí las pausas, por ejemplo `PAUSA_MIN = 20000` y `PAUSA_MAX = 45000` (unas 60 por hora).

---

## Avisos

- Instagram no publica sus límites. Las pausas reducen el riesgo de bloqueo pero **no lo eliminan**. Usalo bajo tu responsabilidad.
- Los seguidores **nuevos** no quedan ocultos automáticamente: volvé a correr el script antes de subir otra historia.
- Si Instagram cambia el diseño de la página, el script puede dejar de funcionar.
