export const rupiah = (n: number) =>
  'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// "salsabila.jj@wattwise.id" -> "Salsabila Jj"
export const nameFromEmail = (email: string) => {
  const base = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim();
  const name = base
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return name || email;
};
