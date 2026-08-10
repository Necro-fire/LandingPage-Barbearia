import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A parte de login, remova a parte que tem APPLE deixe somente o google</p>
      </div>
    </>
  );
}

