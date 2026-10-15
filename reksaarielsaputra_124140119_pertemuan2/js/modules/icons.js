// js/modules/icons.js — set ikon SVG 2D monokrom (hitam-putih, gaya line icon)

const wrap = (inner) =>
  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const iconDashboard = () => wrap(
  '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
);

export const iconCalendar = () => wrap(
  '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
);

export const iconTodo = () => wrap(
  '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
);

export const iconNote = () => wrap(
  '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'
);

export const iconBell = () => wrap(
  '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'
);

export const iconSearch = () => wrap(
  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'
);

export const iconTrash = () => wrap(
  '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'
);

export const iconPencil = () => wrap(
  '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>'
);

export const iconClock = () => wrap(
  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
);

export const iconPin = () => wrap(
  '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'
);

export const iconCap = () => wrap(
  '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><line x1="22" y1="10" x2="22" y2="16"/>'
);

export const iconSun = () => wrap(
  '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
);

export const iconCloud = () => wrap(
  '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>'
);

export const iconCloudSun = () => wrap(
  '<circle cx="8" cy="8" r="3.2"/><line x1="8" y1="1.5" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="14.5"/><line x1="2.5" y1="8" x2="4" y2="8"/><line x1="12" y1="8" x2="13.5" y2="8"/><line x1="4.1" y1="4.1" x2="5.2" y2="5.2"/><line x1="18" y1="15h-1.26A8 8 0 1 0 9 22h9a5 5 0 0 0 0-10z"/>'
);

/** Ikon cuaca berdasar weather_code Open-Meteo -> [label, svg] */
export const cuacaIcon = (code) => {
  if (code === 0) return ['Cerah', iconSun()];
  if (code === 1 || code === 2) return ['Cerah berawan', iconCloudSun()];
  return ['Berawan', iconCloud()];
};
