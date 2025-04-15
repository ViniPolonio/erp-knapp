export default function Footer({ className }) {
  return (
    <footer className={`bg-[#2D2D2D] text-white ${className}`}>
      <div className="container mx-auto px-4 py-2 text-center text-sm">
        © {new Date().getFullYear()} Unitód - Todos os direitos reservados
      </div>
    </footer>
  )
}