document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const cancelarBtn = document.getElementById('cancelar');
    
    // Función para validar RUT chileno
    function validarRUT(rut) {
    // Eliminar espacios, puntos y guiones, y convertir a mayúsculas
    rut = rut.trim().replace(/\./g, '').replace(/-/g, '').toUpperCase();
    
    // Validar longitud mínima y formato general
    if (!/^[0-9]+[0-9K]$/.test(rut) || rut.length < 2) {
        return false;
    }
    
    // Separar cuerpo y dígito verificador
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    // Calcular DV esperado
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    // Validar que el DV coincida
    return dv === dvCalculado;
}
    
    // Función para validar fecha en formato dd/mm/yyyy
    function validarFecha(fecha) {
        if (!fecha) return true;
        
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(fecha)) return false;
        
        const partes = fecha.split('/');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const anio = parseInt(partes[2], 10);
        
        const fechaObj = new Date(anio, mes, dia);
        
        return (
            fechaObj.getDate() === dia &&
            fechaObj.getMonth() === mes &&
            fechaObj.getFullYear() === anio
        );
    }
    
    // Función para validar contraseña (se mantiene igual)
    function validarPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/;
        return regex.test(password);
    }
    
    // Función para validar archivo (se mantiene igual)
    function validarArchivo(archivo) {
        if (!archivo) return true;
        
        const extensionesPermitidas = ['pdf', 'docx'];
        const extension = archivo.name.split('.').pop().toLowerCase();
        return extensionesPermitidas.includes(extension);
    }
    
    // Función para mostrar error (se mantiene igual)
    function mostrarError(campo, mensaje) {
        const errorElement = document.getElementById(`${campo}Error`);
        errorElement.textContent = mensaje;
        document.getElementById(campo).classList.add('input-error');
    }
    
    // Función para limpiar error (se mantiene igual)
    function limpiarError(campo) {
        const errorElement = document.getElementById(`${campo}Error`);
        errorElement.textContent = '';
        document.getElementById(campo).classList.remove('input-error');
    }
    
    // Función para validar campo individual (ajustada para nuevos placeholders)
    function validarCampo(campo) {
        const valor = document.getElementById(campo).value.trim();
        const archivo = campo === 'cv' ? document.getElementById(campo).files[0] : null;
        
        switch (campo) {
            case 'nombre':
                if (!valor) {
                    mostrarError(campo, 'El nombre completo es requerido');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            case 'rut':
                if (!valor) {
                    mostrarError(campo, 'El RUT es requerido');
                    return false;
                }
                if (!validarRUT(valor)) {
                    mostrarError(campo, 'El RUT no es válido');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            case 'fechaNacimiento':
                if (valor && !validarFecha(valor)) {
                    mostrarError(campo, 'Formato de fecha inválido (dd/mm/aaaa)');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            case 'cv':
                if (archivo && !validarArchivo(archivo)) {
                    mostrarError(campo, 'Solo se permiten archivos PDF o DOCX');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            case 'email':
                if (!valor) {
                    mostrarError(campo, 'El email es requerido');
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                    mostrarError(campo, 'El email no es válido');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            case 'password':
                if (!valor) {
                    mostrarError(campo, 'La contraseña es requerida');
                    return false;
                }
                if (!validarPassword(valor)) {
                    mostrarError(campo, 'Debe tener 1 mayúscula, 1 minúscula, 1 número y 6-12 caracteres');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!valor) {
                    mostrarError(campo, 'Debe repetir la contraseña');
                    return false;
                }
                if (valor !== password) {
                    mostrarError(campo, 'Las contraseñas no coinciden');
                    return false;
                }
                limpiarError(campo);
                return true;
                
            default:
                return true;
        }
    }
    
    // Validación en tiempo real (se mantiene igual)
    document.getElementById('nombre').addEventListener('blur', () => validarCampo('nombre'));
    document.getElementById('rut').addEventListener('blur', () => validarCampo('rut'));
    document.getElementById('fechaNacimiento').addEventListener('blur', () => validarCampo('fechaNacimiento'));
    document.getElementById('cv').addEventListener('change', () => validarCampo('cv'));
    document.getElementById('email').addEventListener('blur', () => validarCampo('email'));
    document.getElementById('password').addEventListener('blur', () => validarCampo('password'));
    document.getElementById('confirmPassword').addEventListener('blur', () => validarCampo('confirmPassword'));
    
    // Función para limpiar el formulario (se mantiene igual)
    function limpiarFormulario() {
        form.reset();
        document.querySelectorAll('.error').forEach(error => error.textContent = '');
        document.querySelectorAll('input, select').forEach(input => input.classList.remove('input-error'));
    }
    
    // Evento para el botón cancelar (se mantiene igual)
    cancelarBtn.addEventListener('click', limpiarFormulario);
    
    // Evento para el envío del formulario (se mantiene igual)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const campos = ['nombre', 'rut', 'fechaNacimiento', 'cv', 'email', 'password', 'confirmPassword'];
        let valido = true;
        
        campos.forEach(campo => {
            if (!validarCampo(campo)) valido = false;
        });
        
        if (valido) {
            alert('Formulario enviado correctamente');
            limpiarFormulario();
        }
    });
});