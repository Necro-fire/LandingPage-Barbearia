import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>Nem todos os elementos do login como a senha não podem está em caixa alta.</p>
      </div>
    </>
  );
}

