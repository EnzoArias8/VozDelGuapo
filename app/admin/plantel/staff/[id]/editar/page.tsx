import EditStaffClient from "./EditStaffClient";

// Generamos un ID base para el build
export function generateStaticParams() {
  return [{ id: 'id' }];
}

export default function Page() {
  return <EditStaffClient />;
}