import NoticiaClient from "./NoticiaClient";

// Esta función es la que arregla el error del build
export function generateStaticParams() {
  // Generamos un slug ficticio. Esto creará el archivo noticias/detalle.html
  // que servirá como base para todas tus noticias en DonWeb.
  return [{ slug: 'detalle' }];
}

export default function Page() {
  return <NoticiaClient />;
}
