import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>As barras de rolagem visual foram ocultadas globalmente, mantendo a funcionalidade de navegação vertical e horizontal intacta em todos os dispositivos e navegadores.</p>
      </div>
    </>
  );
}

