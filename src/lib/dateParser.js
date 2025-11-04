export const opciones = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

export function formatDate(fechaString) {
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-MX', opciones);
}