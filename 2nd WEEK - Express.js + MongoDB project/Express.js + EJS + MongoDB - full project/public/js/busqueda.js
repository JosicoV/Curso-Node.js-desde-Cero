const input = document.getElementById('busqueda');
const usersList = document.getElementById('users-list'); // Corregido: el ID correcto del UL es 'users-list'

let timeout; //añadimos un tiempo de espera de 300ms después de que el usuario deja de escribir para mostrar resultados.

input.addEventListener('input', async () => {
    clearTimeout(timeout); //Reiniciamos la espera tras cada pulsación de tecla

    timeout = setTimeout(async () => {

        const q = input.value;

        // Asegúrate de que usersList exista antes de intentar modificarlo
        if (!usersList) {
            console.error("Elemento con ID 'users-list' no encontrado.");
            return;
        }

        const res = await fetch(`/api/usuarios?q=${encodeURIComponent(q)}`); // Usar template literals correctamente
        const usuarios = await res.json();

        usersList.innerHTML = ''; // Limpiar la lista actual

        usuarios.forEach(usuario => {
            const li = document.createElement('li');
            let userHtml = `<strong>Nombre:</strong> ${usuario.nombre} - <strong>Email:</strong> ${usuario.email}<br>`;

            if (usuario.foto) {
                userHtml += `<img src="/fotos/${usuario.foto}" alt="Foto del perfil" style="max-width: 150px; height: auto;"><br>`; // Añadido un poco de estilo para que no sea muy grande
            }
            if (usuario.curriculum) {
                userHtml += `<a href="/curriculums/${usuario.curriculum}" target="_blank">Descargar Curriculum</a><br>`;
            }
            userHtml += `<form action="/eliminar" method="post" style="display: inline;">
                            <input type="hidden" name="email" value="${usuario.email}">
                            <button type="submit">Eliminar</button>
                        </form>`;
            li.innerHTML = userHtml;
            usersList.appendChild(li);
            usersList.appendChild(document.createElement('hr')); // Añadir el <hr> después de cada li
        });
    }, 300); // 300ms de espera después de escribir
});
