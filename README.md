# 🗓️ Nanina Studio - Sistema de Turnos Online

Sitio web interactivo para la gestión de turnos de **Nanina Studio**. Permite a las clientas visualizar días disponibles, elegir horarios en tiempo real y realizar la reserva vía WhatsApp.

## 🚀 Características
* **Sincronización con Google Sheets:** Los turnos ocupados se filtran automáticamente desde una hoja de cálculo.
* **Filtro Inteligente:** Oculta automáticamente horarios pasados (margen de 5 min) para el día actual.
* **Módulo de Reseñas:** Sistema de valoración con estrellas y comentarios almacenados en la nube.
* **Interfaz Mobile-First:** Diseño optimizado para celulares.

## 🛠️ Tecnologías
* **Frontend:** HTML5, CSS3 (Estética personalizada), JavaScript Vanilla.
* **Backend:** Google Apps Script (como API persistente).
* **Hosting:** GitHub Pages.

## 📝 Cómo actualizar la Agenda
Para cambiar los días que aparecen disponibles en la web, debés editar el archivo `script.js`:

1.  Buscá la constante `disp`.
2.  Agregá o quitá los días siguiendo el formato: `"Día Número": hC`.
    * *Ejemplo:* `"Lunes 1": hC, "Martes 2": hC`
3.  Subí los cambios a GitHub:
    ```bash
    git add .
    git commit -m "Actualización de agenda"
    git push origin main
    ```

## 📊 Conexión con Google Sheets
El sistema lee y escribe en dos hojas principales:
* **Agenda:** Donde se guardan los turnos confirmados (Columnas: `fecha`, `hora`, `nombre`, `servicio`).
* **Reseñas:** Donde se almacenan los comentarios de las clientas.

---
✨ *Desarrollado por Agustina Monzón*