import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>Pelo visto o erro de login está por causa que eu não consigo fazer login se o e-mail não tiver:  número tipo esse: admin123@gmail.com, e o que está adicionado é esse: admin@gmail.com</p>
      </div>
    </>
  );
}

