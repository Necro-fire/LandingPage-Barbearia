import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>Todos os elementos deve ser responsivos e focado no formato de celular, o sistema é para celular, há elementos que estão atrapalhando a visão.</p>
      </div>
    </>
  );
}

