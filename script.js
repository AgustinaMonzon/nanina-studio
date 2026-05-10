// ==================== CONFIGURACIÓN ====================
const urlAPI = 'https://script.google.com/macros/s/AKfycbw87nIVDPQ6bNHsXONfJRHzXvfx_bX4GKhVJYxb8XWiuatDmtBeXHm_IC8RyiO7EzIyRA/exec';

const hC = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];

const disp = {
    "Martes 12": hC, "Miércoles 13": hC, "Jueves 14": hC, "Viernes 15": hC, "Sábado 16": hC,
    "Martes 19": hC, "Miércoles 20": hC, "Jueves 21": hC, "Viernes 22": hC, "Sábado 23": hC,
    "Martes 26": hC, "Miércoles 27": hC, "Jueves 28": hC, "Viernes 29": hC, "Sábado 30": hC
};

const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const sD = document.getElementById('dia');
const sH = document.getElementById('hora');

// Función auxiliar para normalizar texto (quita tildes y espacios)
const normalizar = (texto) => {
    if (!texto) return "";
    return texto.toString().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
        .trim();
};

function init() {
    const ahora = new Date();
    const hoyNumero = ahora.getDate();
    if (!sD) return;
    sD.innerHTML = '';
    Object.keys(disp).forEach(d => {
        const numeroDia = parseInt(d.match(/\d+/));
        if (numeroDia >= hoyNumero) {
            let o = document.createElement('option');
            o.value = d; o.text = d;
            sD.appendChild(o);
        }
    });
    if (sD.options.length > 0) upd(); 
    cargarReseñas();
} 

async function upd() {
    if (!sD || !sD.value) return;
    const dS = sD.value;
    const ahora = new Date();
    const hoyLabel = `${nombresDias[ahora.getDay()]} ${ahora.getDate()}`;
    
    sH.innerHTML = '<option>Cargando...</option>';
    sH.disabled = true;

    try {
        const res = await fetch(`${urlAPI}?sheet=Agenda`);
        const data = await res.json();
        const ocupados = Array.isArray(data) ? data : (data.data || []);

        sH.innerHTML = '';
        (disp[dS] || []).forEach(h => {
            const [hT, mT] = h.split(':').map(Number);
            
            // 1. Filtro: ¿Ya pasó la hora hoy?
            let yaPaso = false;
            if (normalizar(dS) === normalizar(hoyLabel)) {
                if (hT < ahora.getHours() || (hT === ahora.getHours() && mT <= ahora.getMinutes() + 5)) {
                    yaPaso = true;
                }
            }

            // 2. Filtro: ¿Está en el Excel de Agenda?
            const estaOcupado = ocupados.some(t => {
                const fechaExcel = normalizar(t.fecha);
                const fechaWeb = normalizar(dS);
                // Extrae HH:mm del Excel para ignorar segundos o fechas largas
                const horaExcel = t.hora ? t.hora.toString().match(/(\d{1,2}):(\d{2})/)?.[0].padStart(5, '0') : "";
                const horaWeb = h.padStart(5, '0');
                
                return fechaExcel === fechaWeb && horaExcel === horaWeb;
            });

            if (!yaPaso && !estaOcupado) {
                let o = document.createElement('option');
                o.value = h; o.text = h + " hs";
                sH.appendChild(o);
            }
        });

        const hay = sH.options.length > 0;
        if (document.getElementById('btnWhatsapp')) document.getElementById('btnWhatsapp').disabled = !hay;
        sH.disabled = !hay;
        if (!hay) sH.innerHTML = '<option>Sin turnos</option>';
    } catch (e) {
        sH.innerHTML = '<option>Error</option>';
    }
}

// ... mantener funciones de reseñas y enviarTurno igual ...

// Las funciones enviarTurno(), enviarReseña() y cargarReseñas() se mantienen igual que antes
function enviarTurno() {
    const msg = `Hola Nanina! 👋 Quiero reservar un turno para el ${sD.value} a las ${sH.value} hs.`;
    window.open(`https://wa.me/5493415778540?text=${encodeURIComponent(msg)}`, '_blank');
}

let estrellasSel = 0;
document.querySelectorAll('.star').forEach(s => {
    s.onclick = (e) => {
        estrellasSel = e.target.dataset.value;
        document.querySelectorAll('.star').forEach(x => {
            x.classList.toggle('active', x.dataset.value <= estrellasSel);
        });
    };
});

function toggleReviewForm() {
    const f = document.getElementById('form-opinion');
    f.style.display = (f.style.display === 'none' || f.style.display === '') ? 'block' : 'none';
}

async function enviarReseña() {
    const n = document.getElementById('rev-nombre').value;
    const c = document.getElementById('rev-comentario').value;
    if (!n || !c || estrellasSel === 0) return alert("Por favor completá todos los campos.");
    try {
        await fetch(`${urlAPI}?sheet=Reseñas`, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: n, estrellas: estrellasSel, comentario: c, fecha: new Date().toLocaleDateString('es-AR') })
        });
        alert("¡Gracias por tu opinión!");
        location.reload();
    } catch (e) { alert("Error al enviar."); }
}

async function cargarReseñas() {
    const cont = document.getElementById('contenedor-resenas');
    if (!cont) return;
    try {
        const res = await fetch(`${urlAPI}?sheet=Reseñas`);
        const datos = await res.json();
        if (!Array.isArray(datos) || datos.length === 0) {
            cont.innerHTML = "<p>¡Sé la primera en opinar! 💕</p>";
            return;
        }
        cont.innerHTML = '';
        datos.reverse().slice(0, 10).forEach(r => {
            const div = document.createElement('div');
            div.className = 'resena-card';
            const e = parseInt(r.estrellas) || 5;
            div.innerHTML = `<strong>${r.nombre || 'Anónimo'}</strong><div style="color:#D4AF37">${'★'.repeat(e)}${'☆'.repeat(5-e)}</div><p>${r.comentario || ''}</p>`;
            cont.appendChild(div);
        });
    } catch (e) { cont.innerHTML = "<p>Aún no hay reseñas.</p>"; }
}

if (sD) sD.onchange = upd;
window.onload = init;