export function AppFooter() {
  return (
    <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground md:px-6">
      <p>
        © {new Date().getFullYear()} Barbearia — Sistema de gestão. Todos os direitos reservados.
      </p>
    </footer>
  );
}
