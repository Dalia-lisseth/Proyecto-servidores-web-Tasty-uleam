import type { Usuario } from '../types';
// Persistencia temporal del frontend mediante localStorage.

// Obtener todos los usuarios
export const obtenerUsuarios = (): Usuario[] => {
  const usuarios = localStorage.getItem('usuarios');
  return usuarios ? JSON.parse(usuarios) : [];
};

// Guardar usuarios
export const guardarUsuarios = (usuarios: Usuario[]): void => {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

// Obtener usuario por email (usando localStorage)
export const obtenerUsuarioPorEmail = async (email: string): Promise<Usuario | undefined> => {
  try {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    return usuario;
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    return undefined;
  }
};

// Obtener usuario actual (logueado)
export const obtenerUsuarioActual = (): Usuario | null => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) return null;
  
  const usuarios = obtenerUsuarios();
  return usuarios.find(u => u.id.toString() === userId) || null;
};

// Guardar sesión de usuario
export const guardarSesion = (usuario: Usuario): void => {
  sessionStorage.setItem('userId', usuario.id.toString());
  sessionStorage.setItem('userEmail', usuario.email);
  sessionStorage.setItem('userNombre', usuario.nombre);
  sessionStorage.setItem('isLoggedIn', 'true');
};

// Cerrar sesión
export const cerrarSesion = (): void => {
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userNombre');
  sessionStorage.removeItem('isLoggedIn');
};

// Verificar si hay usuario logueado
export const estaLogueado = (): boolean => {
  return sessionStorage.getItem('isLoggedIn') === 'true';
};

// Registrar usuario
export interface RegistroDatos {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export const registrarUsuario = async (datos: RegistroDatos): Promise<{ success: boolean; error?: string }> => {
  if (datos.password !== datos.confirmPassword) {
    return { success: false, error: 'Las contraseñas no coinciden.' };
  }

  if (datos.password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  try {
    // Obtener usuarios existentes
    const usuarios = obtenerUsuarios();
    
    // Verificar si el email ya existe
    const emailExiste = usuarios.some(u => u.email.toLowerCase() === datos.email.toLowerCase());
    if (emailExiste) {
      return { success: false, error: 'Este correo electrónico ya está registrado. Por favor inicia sesión.' };
    }

    // Generar ID único (usar timestamp + random)
    const nuevoId = Date.now() + Math.floor(Math.random() * 1000);

    // Crear nuevo usuario (guardar contraseña hasheada simple - solo para desarrollo local)
    // NOTA: En producción, usar un hash seguro como bcrypt
    const nuevoUsuario: Usuario = {
      id: nuevoId,
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email.toLowerCase(),
      telefono: datos.telefono,
      password: datos.password, // En producción, esto debería ser un hash
      fechaRegistro: new Date().toISOString(),
      activo: true,
    };

    // Agregar usuario a la lista
    usuarios.push(nuevoUsuario);
    
    // Guardar en localStorage
    guardarUsuarios(usuarios);

    // Guardar en sesión (sin contraseña)
    const usuarioSesion = { ...nuevoUsuario };
    usuarioSesion.password = '';
    guardarSesion(usuarioSesion);

    console.log('Usuario registrado exitosamente:', nuevoUsuario.email);
    return { success: true };
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    return { success: false, error: error.message || 'Error al registrar el usuario.' };
  }
};

// Iniciar sesión (usando localStorage)
export const iniciarSesion = async (email: string, password: string): Promise<{ success: boolean; error?: string; usuario?: Usuario }> => {
  try {
    // Obtener usuarios de localStorage
    const usuarios = obtenerUsuarios();
    
    // Buscar usuario por email
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!usuario) {
      return { success: false, error: 'Correo electrónico o contraseña incorrectos.' };
    }

    // Verificar contraseña (comparación simple - en producción usar hash)
    if (usuario.password !== password) {
      return { success: false, error: 'Correo electrónico o contraseña incorrectos.' };
    }

    // Verificar si la cuenta está activa
    if (!usuario.activo) {
      return { success: false, error: 'Tu cuenta ha sido desactivada. Contacta al administrador.' };
    }

    // Crear objeto de usuario sin contraseña para la sesión
    const usuarioSesion: Usuario = {
      ...usuario,
      password: '', // No guardar contraseña en sesión
    };

    // Guardar en sesión
    guardarSesion(usuarioSesion);
    
    console.log('Login exitoso:', usuario.email);
    return { success: true, usuario: usuarioSesion };
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: error.message || 'Error al iniciar sesión.' };
  }
};

// Admin functions
export const verificarAdminLogueado = (): boolean => {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
};

export const loginAdmin = (email: string, password: string): boolean => {
  try {
    // Validar que los parámetros existan
    if (!email || !password) {
      console.error('loginAdmin: Email o password no proporcionados');
      return false;
    }

    // Normalizar inputs - eliminar espacios y convertir a minúsculas
    const emailNormalizado = String(email).trim().toLowerCase();
    const passwordNormalizado = String(password).trim();
    
    // Debug detallado
    console.log('=== LOGIN ADMIN DEBUG ===');
    console.log('Email original:', JSON.stringify(email));
    console.log('Email normalizado:', JSON.stringify(emailNormalizado));
    console.log('Password original:', JSON.stringify(password));
    console.log('Password normalizado:', JSON.stringify(passwordNormalizado));
    console.log('Email length:', emailNormalizado.length);
    console.log('Password length:', passwordNormalizado.length);

    // Validar que no estén vacíos después de normalizar
    if (!emailNormalizado || !passwordNormalizado) {
      console.error('Error: Email o password vacíos después de normalizar');
      return false;
    }

    // Credenciales válidas
    const ADMIN_EMAIL = 'admin@tastyuleam.com';
    const ADMIN_PASSWORD = 'admin123';
    const ADMIN_EMAIL_ALT = 'admin';
    
    // Verificar credenciales exactas
    const esEmailValido = 
      emailNormalizado === ADMIN_EMAIL || 
      emailNormalizado === ADMIN_EMAIL_ALT;
    
    const esPasswordValido = passwordNormalizado === ADMIN_PASSWORD;
    
    console.log('Comparación de email:');
    console.log('  - Email normalizado:', emailNormalizado);
    console.log('  - ADMIN_EMAIL:', ADMIN_EMAIL);
    console.log('  - ADMIN_EMAIL_ALT:', ADMIN_EMAIL_ALT);
    console.log('  - Coincide con ADMIN_EMAIL:', emailNormalizado === ADMIN_EMAIL);
    console.log('  - Coincide con ADMIN_EMAIL_ALT:', emailNormalizado === ADMIN_EMAIL_ALT);
    console.log('  - Email válido:', esEmailValido);
    
    console.log('Comparación de password:');
    console.log('  - Password normalizado:', passwordNormalizado);
    console.log('  - ADMIN_PASSWORD:', ADMIN_PASSWORD);
    console.log('  - Coincide exactamente:', passwordNormalizado === ADMIN_PASSWORD);
    console.log('  - Password válido:', esPasswordValido);

    if (esEmailValido && esPasswordValido) {
      try {
        // Guardar en sessionStorage
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', String(email).trim());
        
        // Verificar que se guardó correctamente
        const verificado = sessionStorage.getItem('adminLoggedIn') === 'true';
        console.log('✅ Login exitoso');
        console.log('✅ SessionStorage guardado:', verificado);
        console.log('✅ AdminEmail guardado:', sessionStorage.getItem('adminEmail'));
        return true;
      } catch (storageError) {
        console.error('Error al guardar en sessionStorage:', storageError);
        return false;
      }
    }

    console.log('❌ Credenciales inválidas');
    console.log('❌ Email válido:', esEmailValido, '| Password válido:', esPasswordValido);
    return false;
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    return false;
  }
};

export const cerrarSesionAdmin = (): void => {
  sessionStorage.removeItem('adminLoggedIn');
  sessionStorage.removeItem('adminEmail');
};
