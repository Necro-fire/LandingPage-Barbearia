import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>O design do login está assimetrico da parte esquerda e não está responsivo no celular.</p>
      </div>
    </>
  );
}

