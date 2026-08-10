import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A página de login foi simplificada, removendo o banner visual lateral e focando exclusivamente no formulário de acesso para uma experiência mais direta.</p>
      </div>
    </>
  );
}

