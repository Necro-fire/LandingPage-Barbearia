import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A navegação foi otimizada para dispositivos móveis, garantindo que todos os módulos estejam acessíveis e responsivos na barra inferior.</p>
      </div>
    </>
  );
}

